import { request } from './client';

export interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
}

export const authApi = {
  getMe: () => request<User | null>('/auth/me').catch(() => null),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  getLoginUrl: () => '/oauth2/authorization/google',
};
