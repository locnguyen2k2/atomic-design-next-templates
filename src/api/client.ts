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
    console.error('Error parsing nexusiam-storage', e);
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
    console.error('Error parsing nexusiam-storage', e);
  }
  return null;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
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
        throw new Error(`HTTP error! status: ${response.status}`);
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
    });
  }
}

const apiClient = new ApiClient(baseURL);
export default apiClient;
