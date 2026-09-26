import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, Stack, Button, Chip, Fade, Alert
} from '@mui/material';
import Loader from '../shared/ui/Loader';
import EmptyState from '../shared/ui/EmptyState';
import { fetchBookings } from '../shared/api/mockApi';
import type { Booking } from '../entities/booking/types';


export default function MyBookings() {
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchBookings();
        setBookings(data);
      } catch {
        setError('Не удалось загрузить брони');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCancel = (id: number) => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      alert(`Бронирование ${id} отменено (демо)`);
    }
  };

  const filteredBookings = bookings.filter((b) =>
    tabValue === 0
      ? (b.status === 'active' || b.status === 'queued')
      : b.status === 'completed'
  );

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':    return <Chip label="Подтверждено" color="success" />;
      case 'queued':    return <Chip label="В очереди" color="warning" />;
      case 'completed': return <Chip label="Завершено" color="default" variant="outlined" />;
      default:          return null;
    }
  };

  // ===== ЗАГРУЗКА =====
  if (isLoading) return <Loader />;

  // ===== ОШИБКА =====
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <EmptyState title="Ошибка" description="Попробуйте позже" />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h1" sx={{ mb: 2 }}>Мои бронирования</Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Активные" />
        <Tab label="История" />
      </Tabs>

      <Fade in timeout={500}>
        <Stack spacing={2}>
          {filteredBookings.length === 0 ? (
            <EmptyState
              title="Здесь пусто"
              description={
                tabValue === 0
                  ? 'У вас пока нет активных броней'
                  : 'История броней пуста'
              }
            />
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h3">{booking.machineName}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {booking.date} • {booking.time}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    {getStatusChip(booking.status)}
                    {tabValue === 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Отменить
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Fade>
    </Box>
  );
}