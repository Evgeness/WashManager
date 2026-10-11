import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Stack, Link, Divider, InputAdornment, IconButton, Alert, Grow
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { authApi } from '../shared/api/authApi';
import { useAuth } from '../shared/context/AuthContext';


interface FormErrors {
  full_name?: string;
  room?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}


export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();               // используем login для автологина после регистрации

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '', room: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

 
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (field === 'room') {
      value = value.replace(/\D/g, '').slice(0, 4);   // только цифры, максимум 4
    }
    setFormData({ ...formData, [field]: value });
  };


  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Введите ФИО';
    } else if (formData.full_name.trim().split(/\s+/).length < 2) {
      newErrors.full_name = 'Укажите имя и фамилию';
    }

    if (!formData.room) {
      newErrors.room = 'Введите номер комнаты';
    }

    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 // ===== ОТПРАВКА =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // 1. Регистрация через API
      await authApi.register({
        full_name: formData.full_name.trim(),
        room: formData.room,
        email: formData.email,
        password: formData.password,
      });

      // 2. Автоматический вход после регистрации
      await login(formData.email, formData.password);

      // 3. Редирект на главную
      navigate('/');
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : 'Не удалось зарегистрироваться. Попробуйте позже.';
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
        <Card sx={{ width: '100%', maxWidth: 480 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <Box component="img" src={logo} alt="WashManager" sx={{ height: 60, width: 'auto' }} />
              <Typography variant="h1" sx={{ fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>
                Регистрация
              </Typography>
              <Typography color="text.secondary">Создайте аккаунт для бронирования</Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>

                {serverError && (
                  <Alert severity="error" onClose={() => setServerError(null)}>
                    {serverError}
                  </Alert>
                )}

                <TextField
                  label="ФИО"
                  value={formData.full_name}
                  onChange={handleChange('full_name')}
                  placeholder="Иванов Иван Иванович"
                  error={!!errors.full_name}
                  helperText={errors.full_name}
                  disabled={isSubmitting}
                />

                <TextField
                  label="Номер комнаты"
                  value={formData.room}
                  onChange={handleChange('room')}
                  placeholder="Например, 412"
                  error={!!errors.room}
                  helperText={errors.room || 'Только цифры, максимум 4 символа'}
                  disabled={isSubmitting}
                  slotProps={{
                    htmlInput: { inputMode: 'numeric', pattern: '[0-9]*', maxLength: 4 },
                  }}
                />

                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="student@example.com"
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isSubmitting}
                />

                <TextField
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={isSubmitting}
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

                <TextField
                  label="Подтвердите пароль"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={isSubmitting}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Создаём...' : 'Создать аккаунт'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
              Уже есть аккаунт?{' '}
              <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
                Войти
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
}