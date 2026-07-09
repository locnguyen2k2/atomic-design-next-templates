import { useAppStore, useAuthStore } from "@/stores";

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004/apis/v1';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nexusiam-token');
}

function getOrganizationId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const storage = localStorage.getItem('nexusiam-storage');
    if (storage) {
      const parsed = JSON.parse(storage);
      return parsed.state.currentOrg || null;
    }
  } catch (e) {
    console.log('Error parsing nexusiam-storage', e);
  }
  return null;
}

function getProjectId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const storage = localStorage.getItem('nexusiam-storage');
    if (storage) {
      const parsed = JSON.parse(storage);
      return parsed.state.currentProject || null;
    }
  } catch (e) {
    console.log('Error parsing nexusiam-storage', e);
  }
  return null;
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const storage = localStorage.getItem('nexusiam-auth-storage');
    if (storage) {
      const parsed = JSON.parse(storage);
      return parsed.state.refreshToken || null;
    }
  } catch (e) {
    console.log('Error parsing nexusiam-auth-storage', e);
  }
  return null;
}


class ApiClient {
  private baseURL: string;
  private isRefreshing: boolean = false;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (refreshToken) return refreshToken;

    try {
      const response = await fetch(`${this.baseURL}/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();
      const tokens = data.data || data;
      const newAccessToken = tokens.access_token;

      localStorage.setItem('nexusiam-token', newAccessToken);

      const storage = localStorage.getItem('nexusiam-auth-storage');
      if (storage) {
        const parsed = JSON.parse(storage);
        parsed.state.accessToken = newAccessToken;
        parsed.state.refreshToken = tokens.refresh_token || refreshToken;
        parsed.state.expiresIn = tokens.expires_in;
        localStorage.setItem('nexusiam-auth-storage', JSON.stringify(parsed));
      }

      return newAccessToken;
    } catch (error) {
      console.log('Token refresh error:', error);
      localStorage.clear();
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken();
    const orgId = getOrganizationId();
    const projectId = getProjectId();
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (orgId) {
      headers['organization-id'] = orgId;
    }

    if (projectId) {
      headers['project-id'] = projectId;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();

            if (newToken) {
              headers.Authorization = `Bearer ${newToken}`;
              const retryConfig: RequestInit = {
                ...options,
                headers,
              };

              const retryResponse = await fetch(url, retryConfig);

              if (!retryResponse.ok) {
                throw new Error(`HTTP error! status: ${retryResponse.status}`);
              }

              const contentType = retryResponse.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                return await retryResponse.json();
              }
              return {} as T;
            } else {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('nexusiam-token');
                window.location.href = '/login';
              }
            }
          } catch (refreshError) {
            localStorage.removeItem('nexusiam-token');
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject({
          status: response.status,
          message: errorData.message || 'An error occurred',
          details: errorData,
        });
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return {} as T;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, {
      headers,
    });
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({})
    });
  }
}

const apiClient = new ApiClient(baseURL);
export default apiClient;
