import { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, TextField, Button, 
  Stack, Link, Divider, InputAdornment, IconButton 
} from '@mui/material';
// Link — компонент для ссылок
// InputAdornment — «насадка» внутри поля (для иконки показа пароля)
// IconButton — кнопка с иконкой

import { Visibility, VisibilityOff } from '@mui/icons-material';  // Иконки глаза
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Login() {
  // useNavigate — хук для программного перехода между страницами
  const navigate = useNavigate();

  // Стейт: показывать ли пароль в открытом виде
  const [showPassword, setShowPassword] = useState(false);

  // Стейт формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();       // Отменяем стандартное поведение формы (перезагрузку)
    
    // ЗАГЛУШКА: тут будет реальный запрос к API
    alert(`Вход выполнен (демо)\nEmail: ${email}`);
    
    // После успешного входа — редирект на главную
    navigate('/');
  };

  return (
    // Центрируем карточку по вертикали и горизонтали
    <Box 
      sx={{ 
        minHeight: '100vh',               // На всю высоту экрана
        display: 'flex', 
        alignItems: 'center',             // Вертикальное центрирование
        justifyContent: 'center',         // Горизонтальное центрирование
        p: 2,                             // Отступы по краям (для мобильных)
      }}
    >
      {/* Карточка с ограничением ширины 440px */}
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          
          {/* ===== ЛОГОТИП И ЗАГОЛОВОК ===== */}
          <Stack spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
            <Box 
              component="img" 
              src={logo} 
              alt="WashManager" 
              sx={{ height: 60, width: 'auto' }} 
            />
            <Typography variant="h1" sx={{ fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>
              WashManager
            </Typography>
            <Typography color="text.secondary">
              Войдите в свой аккаунт
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* ===== ФОРМА ===== 
              component="form" — Box превращается в тег <form>.
              onSubmit — обработчик отправки. */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              
              {/* Поле Email */}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required                    // HTML5-валидация: обязательное поле
              />

              {/* Поле Пароля с иконкой "показать/скрыть" */}
              <TextField
                label="Пароль"
                // type динамически меняется: password → text
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // slotProps — новый API MUI v6 для настройки внутренних слотов.
                // slotProps.input заменяет старый InputProps.
                slotProps={{
                  input: {
                    // endAdornment — элемент в конце поля (справа)
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={() => setShowPassword(!showPassword)} 
                          edge="end"
                        >
                          {/* Меняем иконку в зависимости от стейта */}
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Кнопка "Войти" */}
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth                    // На всю ширину
                sx={{ mt: 1 }}
              >
                Войти
              </Button>

            </Stack>
          </Box>

          {/* ===== ССЫЛКА НА РЕГИСТРАЦИЮ ===== */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textAlign: 'center', mt: 3 }}
          >
            Нет аккаунта?{' '}
            <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
              Зарегистрироваться
            </Link>
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
}