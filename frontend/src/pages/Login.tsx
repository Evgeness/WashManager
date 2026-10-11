import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Stack, Link, Divider, InputAdornment, IconButton, Alert, Grow
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

// Хук аутентификации — даёт функцию login и состояние
import { useAuth } from '../shared/context/AuthContext';


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();                        // ← функция входа

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Состояние отправки: блокирует кнопку и показывает «Вход...»
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ошибка от сервера (неверный пароль, пользователь не найден)
  const [serverError, setServerError] = useState<string | null>(null);


  // ===== ВАЛИДАЦИЯ =====
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!password) {
      newErrors.password = 'Введите пароль';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // ===== ОТПРАВКА ФОРМЫ =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // не даём браузеру перезагрузить страницу
    setServerError(null); // чистим предыдущую ошибку

    if (!validate()) return; // если валидация не прошла — выходим
 
    setIsSubmitting(true);
    try {
      // Реальный запрос к backend: POST /auth/login
      // Затем автоматически GET /auth/me для получения данных пользователя
      await login(email, password);
      navigate('/');                                   // редирект на главную
    } catch (err) {
      // Если 401 — «Неверный email или пароль»
      // Если сеть упала — другое сообщение
      const message = err instanceof Error
        ? err.message
        : 'Не удалось войти. Попробуйте позже.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Grow in timeout={500}>
        <Card sx={{ width: '100%', maxWidth: 440 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <Box component="img" src={logo} alt="WashManager" sx={{ height: 60, width: 'auto' }} />
              <Typography variant="h1" sx={{ fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>
                WashManager
              </Typography>
              <Typography color="text.secondary">Войдите в свой аккаунт</Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>

                {/* Ошибка от сервера (неверные credentials) */}
                {serverError && (
                  <Alert severity="error" onClose={() => setServerError(null)}>
                    {serverError}
                  </Alert>
                )}

                {/* Ошибки клиентской валидации */}
                {errors.email && <Alert severity="error">{errors.email}</Alert>}
                {errors.password && <Alert severity="error">{errors.password}</Alert>}

                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  error={!!errors.email}
                  disabled={isSubmitting}
                />

                <TextField
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  disabled={isSubmitting}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Вход...' : 'Войти'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
              Нет аккаунта?{' '}
              <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
                Зарегистрироваться
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
}