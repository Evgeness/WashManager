// ===== Защита приватных страниц =====
// Оборачивает страницу и проверяет авторизацию.
// Если пользователь не авторизован — редирект на /login.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Шаг 1: пока идёт проверка /auth/me — показываем Loader.
  if (isLoading) return <Loader />;

  // Шаг 2: не авторизован → редирект.
  // replace — заменяет текущий URL в истории, чтобы кнопка «Назад»
  // не возвращала пользователя на защищённую страницу.
  if (!user) return <Navigate to="/login" replace />;

  // Шаг 3: всё хорошо — рендерим страницу
  return <>{children}</>;
}