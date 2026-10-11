const API_URL = 'http://127.0.0.1:8000';

// Хранилище токенов (в памяти)
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;


// Универсальная функция запроса
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true, // retry=true нужен для авто-повтора после refresh
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Добавляем access-токен, если есть
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Если 401 — пробуем обновить токен
  if (response.status === 401 && retry && refreshToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return apiRequest<T>(endpoint, options, false);   // повтор запроса
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Ошибка запроса');
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}


// Обновление access-токена
async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      clearTokens();
      return false;
    }
    const data = await response.json();
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}