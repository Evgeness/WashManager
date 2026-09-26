import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Stack, Link, Divider, InputAdornment, IconButton, Alert, Grow
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';


export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    alert(`Вход выполнен (демо)\nEmail: ${email}`);
    navigate('/');
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
                {errors.email && <Alert severity="error">{errors.email}</Alert>}
                {errors.password && <Alert severity="error">{errors.password}</Alert>}

                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  error={!!errors.email}
                />

                <TextField
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
                  Войти
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