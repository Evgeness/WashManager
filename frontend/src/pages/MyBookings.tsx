import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, Stack, Button, Chip,
  Fade, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton
} from '@mui/material';
import { Close, WarningAmber } from '@mui/icons-material';
import Loader from '../shared/ui/Loader';
import EmptyState from '../shared/ui/EmptyState';
import { fetchBookings } from '../shared/api/mockApi';
import type { Booking } from '../entities/booking/types';


export default function MyBookings() {
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== Состояние для модалки отмены =====
  // Храним id брони, которую хотим отменить. null — окно закрыто.
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);

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

  // Открыть окно подтверждения отмены
  const handleCancelClick = (id: number) => {
    setCancelBookingId(id);
  };

  // Закрыть окно без отмены
  const handleCancelClose = () => {
    setCancelBookingId(null);
  };

  // Подтвердить отмену
  const handleCancelConfirm = () => {
    if (cancelBookingId !== null) {
      // Здесь будет запрос к API: DELETE /bookings/{id}
      setBookings((prev) =>
        prev.filter((b) => b.id !== cancelBookingId)
      );
      alert(`Бронирование №${cancelBookingId} отменено`);
      setCancelBookingId(null);
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

  // ===== СОСТОЯНИЕ 1: ЗАГРУЗКА =====
  if (isLoading) return <Loader />;

  // ===== СОСТОЯНИЕ 2: ОШИБКА =====
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <EmptyState title="Ошибка" description="Попробуйте позже" />
      </Box>
    );
  }

  // Данные для отображаемой брони (для показа в модалке)
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
                        onClick={() => handleCancelClick(booking.id)}
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

      {/* ===== МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ ОТМЕНЫ ===== */}
      <Dialog
        open={cancelBookingId !== null}
        onClose={handleCancelClose}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          Отмена брони
          <IconButton onClick={handleCancelClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Иконка предупреждения — без круга */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <WarningAmber sx={{ fontSize: 48, color: 'error.main' }} />
          </Box>

          <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>
            Вы уверены?
          </Typography>

          <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
            Бронь на <strong>{bookingToCancel?.machineName}</strong> <br />
            {bookingToCancel?.date}, {bookingToCancel?.time}
          </Typography>

          <Typography color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.85rem' }}>
            Это действие нельзя отменить
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelClose} variant="outlined">
            Нет, оставить
          </Button>
          <Button onClick={handleCancelConfirm} variant="contained" color="error" autoFocus>
            Да, отменить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}