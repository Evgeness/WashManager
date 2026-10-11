// Импортируем Routes и Route для настройки маршрутизации
// (BrowserRouter уже подключён в main.tsx на более высоком уровне)
import { Routes, Route } from 'react-router-dom';

// Импортируем все страницы приложения
import Layout from './shared/ui/Layout';        // Общий каркас с шапкой
import Dashboard from './pages/Dashboard';       // Главная страница
import Schedule from './pages/Schedule';         // Расписание
import MyBookings from './pages/MyBookings';     // Мои брони
import Login from './pages/Login';               // Вход
import Register from './pages/Register';         // Регистрация

// Защита приватных страниц: если пользователь не авторизован —
// редиректит на /login, а во время проверки токена показывает Loader
import ProtectedRoute from './shared/ui/ProtectedRoute';


export default function App() {
  return (
    <Routes>
      {/* ===== СТРАНИЦЫ БЕЗ ШАПКИ =====
          Логин и регистрация отображаются отдельно —
          без навигации, чтобы пользователь сфокусировался на форме.
          Эти страницы ПУБЛИЧНЫЕ — доступны без авторизации. */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== СТРАНИЦЫ С ОБЩИМ КАРКАСОМ =====
          Вложенные маршруты: Layout рендерит шапку и <Outlet />,
          а внутрь <Outlet /> подставляются дочерние страницы.

          Каждая страница обёрнута в <ProtectedRoute> — это значит,
          что пользователь должен быть авторизован. */}
      <Route path="/" element={<Layout />}>
        {/* index — это маршрут по умолчанию, т.е. "/" */}
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Относительные пути: "/schedule", "/my-bookings" */}
        <Route
          path="schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}