// StrictMode — включает дополнительные проверки React в dev-режиме
import { StrictMode } from 'react';

// createRoot — современный API для рендера React 18+
import { createRoot } from 'react-dom/client';

// ThemeProvider — провайдер темы MUI
import { ThemeProvider } from '@mui/material/styles';

// CssBaseline — глобальный сброс стилей браузера (как normalize.css)
import CssBaseline from '@mui/material/CssBaseline';

// BrowserRouter — провайдер роутинга (HTML5 History API)
import { BrowserRouter } from 'react-router-dom';

// Наша кастомная тема и главный компонент
import { theme } from './app/theme';
import App from './App';

// Глобальные CSS-стили (шрифты, сбросы, @keyframes)
import './index.css';

// Находим корневой DOM-элемент и рендерим приложение.
// "!" в конце — это TypeScript-утверждение, что элемент точно существует.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ThemeProvider — прокидывает тему во все компоненты MUI */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline — применяет базовые стили MUI (тёмный фон и т.д.) */}
      <CssBaseline />
      
      {/* BrowserRouter — даёт доступ к useNavigate, Link, NavLink */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);