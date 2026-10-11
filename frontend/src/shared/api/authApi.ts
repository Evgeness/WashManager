import { apiRequest, setTokens, clearTokens, getRefreshToken } from './client';

export interface LoginRequest  { email: string; password: string; }
export interface RegisterRequest {
  full_name: string; room: string; email: string; password: string;
}
export interface TokenResponse {
  access_token: string; refresh_token: string; token_type: string;
}
export interface User {
  id: number; full_name: string; room: string; email: string;
}

export const authApi = {
  // ===== РЕГИСТРАЦИЯ =====
  // Просто POST, токены не сохраняем — это делает login() отдельно
  register: (data: RegisterRequest) =>
    apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  // ===== ВХОД =====
  // После успеха сохраняем оба токена в памяти
  login: async (data: LoginRequest) => {
    const tokens = await apiRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  // ===== ВЫХОД =====
  // Отзываем refresh на сервере + чистим память.
  // finally — чтобы clearTokens() выполнился даже при ошибке сети.

  logout: async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refresh }),
        });
      }
    } finally {
      clearTokens();
    }
  },

  // ===== ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ =====
  me: () => apiRequest<User>('/auth/me'),
};