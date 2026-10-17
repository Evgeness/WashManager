import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, Stack, Button, Chip,
  Fade, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Snackbar
} from '@mui/material';
import { Close, WarningAmber } from '@mui/icons-material';
import Loader from '../shared/ui/Loader';
import EmptyState from '../shared/ui/EmptyState';
import { bookingApi, type BackendBookingResponse } from '../shared/api/bookingApi';
import type { Booking } from '../entities/booking/types';

const mapBackendBooking = (b: BackendBookingResponse): Booking => {
  const start = new Date(b.start_time);
  const end = new Date(b.end_time);
  
  const time = `${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  const date = start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  return {
    id: b.id,
    machineId: b.machine_id,
    machineName: b.machine_name || `Машина №${b.machine_id}`,
    date: date,
    time: time,
    status: b.status as any,
  };
};

export default function MyBookings() {
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // ДОБАВЛЕН ПАРАМЕТР silent ДЛЯ ФОНОВОГО ОБНОВЛЕНИЯ
  const loadBookings = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setError(null);
      const data = await bookingApi.getAll();
      setBookings(data.map(mapBackendBooking));
    } catch (err: any) {
      if (!silent) setError(err.message || 'Не удалось загрузить брони');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    // Первичная загрузка (с лоадером)
    loadBookings();

    // Авто-обновление каждые 5 секунд (без лоадера)
    const interval = setInterval(() => {
      loadBookings(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCancelClick = (id: number) => setCancelBookingId(id);
  const handleCancelClose = () => setCancelBookingId(null);

  const handleCancelConfirm = async () => {
    if (cancelBookingId !== null) {
      setIsCanceling(true);
      try {
        await bookingApi.delete(cancelBookingId);
        setBookings((prev) => prev.filter((b) => b.id !== cancelBookingId));
        setCancelBookingId(null);
        setSnackbar({ open: true, message: 'Бронь успешно отменена' });
        // После отмены сразу обновляем данные, чтобы подтянуть очередь
        await loadBookings(true); 
      } catch (err: any) {
        alert(err.message || 'Ошибка при отмене брони');
      } finally {
        setIsCanceling(false);
      }
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

  if (isLoading) return <Loader />;
  if (error) return <Box><Alert severity="error" sx={{ mb: 2 }}>{error}</Alert><EmptyState title="Ошибка" description="Попробуйте позже" /></Box>;

  const bookingToCancel = bookings.find((b) => b.id === cancelBookingId);

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
              description={tabValue === 0 ? 'У вас пока нет активных броней' : 'История броней пуста'}
            />
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h3">{booking.machineName}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {booking.date} • {booking.time}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    {getStatusChip(booking.status)}
                    {tabValue === 0 && (
                      <Button variant="outlined" color="error" size="small" onClick={() => handleCancelClick(booking.id)}>
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

      <Dialog open={cancelBookingId !== null} onClose={handleCancelClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Отмена брони
          <IconButton onClick={handleCancelClose} size="small" disabled={isCanceling}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <WarningAmber sx={{ fontSize: 48, color: 'error.main' }} />
          </Box>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>Вы уверены?</Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
            Бронь на <strong>{bookingToCancel?.machineName}</strong> <br />
            {bookingToCancel?.date}, {bookingToCancel?.time}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelClose} variant="outlined" disabled={isCanceling}>Нет, оставить</Button>
          <Button onClick={handleCancelConfirm} variant="contained" color="error" autoFocus disabled={isCanceling}>
            {isCanceling ? 'Отмена...' : 'Да, отменить'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}