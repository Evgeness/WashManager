import { AppBar, Toolbar, Typography, Button, Container, Box, Stack } from '@mui/material';
import { Outlet, NavLink } from 'react-router-dom';
// Outlet — место, куда рендерятся дочерние маршруты (страницы)
// NavLink — как Link, но добавляет класс "active" для текущего маршрута

import logo from '../assets/logo.png'; // Импорт логотипа (Vite сам соберёт путь)

// ===== СТИЛЬ КНОПОК НАВИГАЦИИ =====
// Вынесен отдельно, чтобы не дублировать у трёх кнопок.
const navButtonSx = {
  borderRadius: '999px',           // Полностью скруглённые углы (pill-стиль)
  px: 2.5,                         // Горизонтальные отступы
  py: 1,                           // Вертикальные отступы
  color: 'text.primary',           // Светлый текст по умолчанию
  bgcolor: 'background.paper',     // Слегка подсвеченный фон
  position: 'relative',            // Чтобы z-index работал
  zIndex: 2,                       // Кнопки выше пузырьков

  // Стиль АКТИВНОЙ кнопки (текущая страница)
  '&.active': {
    bgcolor: 'primary.main',       // Синий фон
    color: '#fff',                 // Белый текст
    '&:hover': { bgcolor: 'primary.dark' },
  },

  // Стиль при наведении курсора
  '&:hover': { bgcolor: 'divider' },
};

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
export default function Layout() {
  return (
    // Корневой контейнер: колонка, растягивается на всю высоту экрана
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      
      {/* ===== ШАПКА (AppBar) ===== */}
      <AppBar 
        position="static"          // Не "фиксируется" при скролле
        color="inherit"            // Наследует фон из темы
        sx={{ 
          width: '100%',
          position: 'relative',    // Нужно для absolute-позиционирования пузырьков
          overflow: 'hidden',      // Обрезаем пузырьки, выходящие за пределы
        }}
      >
        {/* ===== ФОН С ПУЗЫРЬКАМИ ===== 
            Декоративный слой: пузырьки поднимаются снизу вверх.
            pointerEvents: 'none' — чтобы не перехватывали клики. */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,              // Занимает весь AppBar (top/right/bottom/left = 0)
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1,             // Ниже кнопок (они на zIndex: 2)
          }}
        >
          {/* Массив пузырьков: каждый со своим размером, позицией,
              задержкой анимации, длительностью и прозрачностью. */}
          {[
            { size: 60, left: '5%',  delay: '0s',   duration: '12s', opacity: 0.10 },
            { size: 30, left: '15%', delay: '2s',   duration: '10s', opacity: 0.15 },
            { size: 80, left: '30%', delay: '1s',   duration: '14s', opacity: 0.08 },
            { size: 40, left: '45%', delay: '3s',   duration: '11s', opacity: 0.12 },
            { size: 25, left: '60%', delay: '0.5s', duration: '9s',  opacity: 0.18 },
            { size: 70, left: '72%', delay: '4s',   duration: '15s', opacity: 0.10 },
            { size: 35, left: '85%', delay: '1.5s', duration: '10s', opacity: 0.15 },
            { size: 50, left: '95%', delay: '2.5s', duration: '13s', opacity: 0.12 },
          ].map((bubble, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                bottom: -100,                        // Старт за пределами (снизу)
                left: bubble.left,                   // Позиция по горизонтали
                width: bubble.size,
                height: bubble.size,
                borderRadius: '50%',                 // Делаем круг
                
                // radial-gradient создаёт эффект объёма: светлое пятно в верхнем левом углу
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${bubble.opacity + 0.15}), rgba(59,130,246,${bubble.opacity}))`,
                
                // Внутренняя тень для ещё большего объёма
                boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.1)',
                
                // Анимация floatUp объявлена в index.css
                animation: `floatUp ${bubble.duration} linear infinite`,
                animationDelay: bubble.delay,        // Каждый пузырёк начинает свою анимацию со своей задержкой
              }}
            />
          ))}
        </Box>

        {/* ===== КОНТЕНТ ШАПКИ ===== 
            position: 'relative' + zIndex: 2 — чтобы контент был ПОВЕРХ пузырьков */}
        <Toolbar sx={{ px: { xs: 2, md: 3 }, position: 'relative', zIndex: 2 }}>
          
          {/* --- ЛЕВАЯ СЕКЦИЯ: логотип + название --- 
              flex: 1 — занимает 1/3 ширины, прижимает содержимое к левому краю */}
          <Stack direction="row" sx={{ flex: 1, alignItems: 'center' }}>
            <Box
              component="img"      // Рендерим <img>, но со стилями MUI Box
              src={logo}
              alt="WashManager logo"
              sx={{ height: 55, width: 'auto', mr: 1.5 }}  // Автоматическая ширина
            />
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 'bold', 
                fontFamily: '"Inter", sans-serif', 
                whiteSpace: 'nowrap',   // Запрещаем перенос на 2 строки
              }}
            >
              WashManager
            </Typography>
          </Stack>

          {/* --- ЦЕНТРАЛЬНАЯ СЕКЦИЯ: навигация --- 
              Без flex — занимает ровно столько места, сколько нужно кнопкам.
              Благодаря flex: 1 у левой и правой секций — блок оказывается по центру. */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {/* NavLink с "end" — подсветка активна ТОЛЬКО на "/" */}
            <Button component={NavLink} to="/" end sx={navButtonSx}>Главная</Button>
            <Button component={NavLink} to="/schedule" sx={navButtonSx}>Расписание</Button>
            <Button component={NavLink} to="/my-bookings" sx={navButtonSx}>Мои брони</Button>
          </Stack>

          {/* --- ПРАВАЯ СЕКЦИЯ: вход и регистрация --- 
              flex: 1 + justifyContent: 'flex-end' — прижимает к правому краю */}
          <Stack direction="row" spacing={1} sx={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button color="inherit" component={NavLink} to="/login" sx={{ position: 'relative', zIndex: 2 }}>
              Войти
            </Button>
            <Button 
              variant="contained"           // Заливка (синий фон)
              component={NavLink} 
              to="/register"
              sx={{ borderRadius: '999px', position: 'relative', zIndex: 2 }}
            >
              Регистрация
            </Button>
          </Stack>

        </Toolbar>
      </AppBar>
      
      {/* ===== ОБЛАСТЬ КОНТЕНТА СТРАНИЦ ===== 
          <Outlet /> подставит сюда Dashboard / Schedule / MyBookings
          в зависимости от текущего URL.
          flexGrow: 1 — растягивается, заполняя всё свободное пространство. */}
      <Container component="main" maxWidth={false} disableGutters sx={{ flexGrow: 1, py: 3, px: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}