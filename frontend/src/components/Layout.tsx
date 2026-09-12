import { AppBar, Toolbar, Typography, Button, Container, Box, Stack } from '@mui/material';
import { Outlet, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const navButtonSx = {
  borderRadius: '999px',
  px: 2.5,
  py: 1,
  color: 'text.primary',
  bgcolor: 'background.paper',
  position: 'relative',
  zIndex: 2,
  '&.active': {
    bgcolor: 'primary.main',
    color: '#fff',
    '&:hover': { bgcolor: 'primary.dark' },
  },
  '&:hover': { bgcolor: 'divider' },
};

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <AppBar 
        position="static" 
        color="inherit" 
        sx={{ 
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ===== ФОН С ПУЗЫРЬКАМИ ===== */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
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
                bottom: -100,
                left: bubble.left,
                width: bubble.size,
                height: bubble.size,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${bubble.opacity + 0.15}), rgba(59,130,246,${bubble.opacity}))`,
                boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.1)',
                animation: `floatUp ${bubble.duration} linear infinite`,
                animationDelay: bubble.delay,
              }}
            />
          ))}
        </Box>

        {/* ===== КОНТЕНТ ШАПКИ ===== */}
        <Toolbar sx={{ px: { xs: 2, md: 3 }, position: 'relative', zIndex: 2 }}>
          
          {/* ЛЕВАЯ СЕКЦИЯ */}
          <Stack direction="row" sx={{ flex: 1, alignItems: 'center' }}>
            <Box
              component="img"
              src={logo}
              alt="WashManager logo"
              sx={{ height: 55, width: 'auto', mr: 1.5 }}
            />
            <Typography 
              variant="h1" 
              sx={{ fontWeight: 'bold', fontFamily: '"Inter", sans-serif', whiteSpace: 'nowrap' }}
            >
              WashManager
            </Typography>
          </Stack>

          {/* ЦЕНТРАЛЬНАЯ СЕКЦИЯ */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button component={NavLink} to="/" end sx={navButtonSx}>Главная</Button>
            <Button component={NavLink} to="/schedule" sx={navButtonSx}>Расписание</Button>
            <Button component={NavLink} to="/my-bookings" sx={navButtonSx}>Мои брони</Button>
          </Stack>

          {/* ПРАВАЯ СЕКЦИЯ */}
          <Stack direction="row" spacing={1} sx={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button color="inherit" component={NavLink} to="/login" sx={{ position: 'relative', zIndex: 2 }}>
              Войти
            </Button>
            <Button 
              variant="contained" 
              component={NavLink} 
              to="/register"
              sx={{ borderRadius: '999px', position: 'relative', zIndex: 2 }}
            >
              Регистрация
            </Button>
          </Stack>

        </Toolbar>
      </AppBar>
      
      <Container component="main" maxWidth={false} disableGutters sx={{ flexGrow: 1, py: 3, px: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}