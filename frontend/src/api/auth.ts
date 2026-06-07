import { apiRequest } from './httpClient';
import type { LoginDto, RegisterDto, LoginResponse, User } from '../types';

// Non-authenticated request helper — no token attached, no redirect on 401.
const authRequest = <T>(path: string, body: unknown): Promise<T> =>
  apiRequest<T>(path, {
    method: 'POST',
    body,
    auth: false,
    redirectOnUnauthorized: false,
  });

export const login = (dto: LoginDto): Promise<LoginResponse> =>
  authRequest<LoginResponse>('/api/auth/login', { email: dto.email, password: dto.password });

// Note: backend register endpoint is /api/auth/register (NOT /api/auth/signup).
export const register = (dto: RegisterDto): Promise<User> =>
  authRequest<User>('/api/auth/register', {
    name: dto.name,
    email: dto.email,
    password: dto.password,
  });

export async function forgotPassword(email: string): Promise<void> {
  await authRequest<{ message: string }>('/api/auth/forgot-password', { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await authRequest<{ message: string }>('/api/auth/reset-password', { token, newPassword });
}
