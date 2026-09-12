import { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, TextField, Button, 
  Stack, Link, Divider, InputAdornment, IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          
          {/* Логотип и заголовок — alignItems */}
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

          {/* Форма */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
              />

                <TextField
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              >
                Войти
              </Button>

            </Stack>
          </Box>

          {/* Ссылка на регистрацию */}
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