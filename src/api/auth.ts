import apiClient from './client';
import type { LoginRequest, RegisterRequest, User } from '@/types';

export interface AuthResponse {
  data: {
    user: User;
    token: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
    };
  }
}


export const authApi = {
  login: async (params: LoginRequest): Promise<AuthResponse> => {
    return await apiClient.post('/users/login', params);
  },

  register: async (params: RegisterRequest): Promise<AuthResponse> => {
    return await apiClient.post('/users/register', params, {
    });
  },

  verifyAccessToken: async (accessToken: string): Promise<User> => {
    return await apiClient.post('/users/verify-access-token',
      { access_token: accessToken },
      {
        'Authorization': `Bearer ${accessToken}`,
      }
    );
  },

  refreshToken: async (refreshToken: string): Promise<Omit<AuthResponse['data']['token'], 'token_type'>> => {
    return await apiClient.post('/users/refresh-token',
      { refresh_token: refreshToken },
      {
      }
    );
  },

  logout: async (accessToken: string, refreshToken: string): Promise<void> => {
    await apiClient.post('/users/logout',
      { access_token: accessToken, refresh_token: refreshToken },
      {
        'Authorization': `Bearer ${accessToken}`,
      }
    );
  },
};