import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Stack, Link, Divider, InputAdornment, IconButton, Alert, Grow
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';


interface FormErrors {
  name?: string;
  room?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}


export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', room: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // ===== ОБРАБОТЧИК ИЗМЕНЕНИЙ =====
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Особый случай: поле «номер комнаты» — пропускаем только цифры
    if (field === 'room') {
      value = value.replace(/\D/g, ''); // удаляем всё, что не цифра
      value = value.slice(0, 4);        // максимум 4 символа
    }

    setFormData({ ...formData, [field]: value });
  };

  // ===== ВАЛИДАЦИЯ =====
  const validate = () => {
    const newErrors: FormErrors = {};

    // --- ФИО ---
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ФИО';
    } else if (formData.name.trim().split(/\s+/).length < 2) {
      newErrors.name = 'Укажите имя и фамилию';
    }

    // --- Номер комнаты (только цифры) ---
    if (!formData.room.trim()) {
      newErrors.room = 'Введите номер комнаты';
    } else if (!/^\d+$/.test(formData.room)) {
      newErrors.room = 'Номер комнаты должен содержать только цифры';
    } else if (formData.room.length > 4) {
      newErrors.room = 'Номер комнаты не может быть длиннее 4 цифр';
    }

    // --- Email ---
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    // --- Пароль ---
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    // --- Подтверждение пароля ---
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    alert(`Регистрация успешна (демо)\nИмя: ${formData.name}\nКомната: ${formData.room}`);
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
                <TextField
                  label="ФИО"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="Иванов Иван Иванович"
                  error={!!errors.name}
                  helperText={errors.name}
                />

                {/* ===== ПОЛЕ НОМЕРА КОМНАТЫ ===== 
                    inputMode="numeric" — на мобильных откроется цифровая клавиатура
                    onChange фильтрует всё, кроме цифр */}
                <TextField
                  label="Номер комнаты"
                  value={formData.room}
                  onChange={handleChange('room')}
                  placeholder="Например, 412"
                  error={!!errors.room}
                  helperText={errors.room || 'Только цифры, максимум 4 символа'}
                  slotProps={{
                    htmlInput: {
                      inputMode: 'numeric',      // цифровая клавиатура на мобильных
                      pattern: '[0-9]*',         // HTML5-валидация
                      maxLength: 4,              // ограничение длины
                    },
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
                />

                <TextField
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
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
                />

                <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
                  Создать аккаунт
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