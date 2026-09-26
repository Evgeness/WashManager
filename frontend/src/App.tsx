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

export default function App() {
  return (
    <Routes>
      {/* ===== СТРАНИЦЫ БЕЗ ШАПКИ ===== 
          Логин и регистрация отображаются отдельно — 
          без навигации, чтобы пользователь сфокусировался на форме. */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== СТРАНИЦЫ С ОБЩИМ КАРКАСОМ ===== 
          Вложенные маршруты: Layout рендерит шапку и <Outlet />,
          а внутрь <Outlet /> подставляются дочерние страницы. */}
      <Route path="/" element={<Layout />}>
        {/* index — это маршрут по умолчанию, т.е. "/" */}
        <Route index element={<Dashboard />} />
        
        {/* Относительные пути: "/schedule", "/my-bookings" */}
        <Route path="schedule" element={<Schedule />} />
        <Route path="my-bookings" element={<MyBookings />} />
      </Route>
    </Routes>
  );
}