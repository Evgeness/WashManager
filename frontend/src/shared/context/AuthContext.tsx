// ===== Глобальный контекст аутентификации =====
// Хранит текущего пользователя и даёт методы login/logout.
// Доступен в любом компоненте через useAuth().
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type User } from '../api/authApi';
import { getAccessToken, clearTokens } from '../api/client';

// ===== ТИП КОНТЕКСТА =====
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Создаём контекст с null по умолчанию.
// null — маркер, что компонент не обёрнут в Provider.
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // При монтировании — пытаемся получить текущего пользователя
  useEffect(() => {
    const load = async () => {
      if (!getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);
  
  // ===== ВХОД =====
  // Два шага: получить токены, потом загрузить пользователя.
  const login = async (email: string, password: string) => {
    await authApi.login({ email, password }); // шаг 1: токены
    const me = await authApi.me();            // шаг 2: данные
    setUser(me);
  };

  // ===== ВЫХОД =====
  // authApi.logout уже отзывает refresh на сервере и чистит токены.
  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  // ===== ОБНОВИТЬ ДАННЫЕ =====
  // Например, после редактирования профиля.
  const refreshUser = async () => {
    const me = await authApi.me();
    setUser(me);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}