import { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, TextField, Button, 
  Stack, Link, Divider, InputAdornment, IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Все поля формы в одном объекте — так удобнее обновлять
  const [formData, setFormData] = useState({
    name: '',
    room: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Универсальный обработчик изменений: принимает имя поля,
  // возвращает функцию-обработчик для этого поля.
  // Такой паттерн избавляет от написания 5 отдельных setX.
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация: пароли должны совпадать
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    // ЗАГЛУШКА: тут будет реальный запрос к API
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
      {/* Карточка регистрации — чуть шире, чем логин (480px) */}
      <Card sx={{ width: '100%', maxWidth: 480 }}>
        <CardContent sx={{ p: 4 }}>
          
          <Stack spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
            <Box component="img" src={logo} alt="WashManager" sx={{ height: 60, width: 'auto' }} />
            <Typography variant="h1" sx={{ fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>
              Регистрация
            </Typography>
            <Typography color="text.secondary">
              Создайте аккаунт для бронирования
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              
              <TextField
                label="ФИО"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Иванов Иван Иванович"
                required
              />

              <TextField
                label="Номер комнаты"
                value={formData.room}
                onChange={handleChange('room')}
                placeholder="Например, 412"
                required
              />

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="student@example.com"
                required
              />

              <TextField
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                required
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

              {/* Поле подтверждения пароля с проверкой */}
              <TextField
                label="Подтвердите пароль"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
                // error=true — включает красную подсветку, если пароли не совпадают
                error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
                // helperText — подпись под полем (появляется только при ошибке)
                helperText={
                  formData.confirmPassword !== '' && formData.password !== formData.confirmPassword
                    ? 'Пароли не совпадают'
                    : ''
                }
              />

              <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
                Создать аккаунт
              </Button>

            </Stack>
          </Box>

          {/* Ссылка на вход для тех, у кого уже есть аккаунт */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textAlign: 'center', mt: 3 }}
          >
            Уже есть аккаунт?{' '}
            <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
              Войти
            </Link>
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
}