import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Tabs, Tab, Fade, Alert, Snackbar } from '@mui/material';
import BookingForm from '../features/booking-machine/BookingForm';
import MachineCard from '../entities/machine/MachineCard';
import Loader from '../shared/ui/Loader';
import { useAuth } from '../shared/context/AuthContext';
import { machineApi } from '../shared/api/machineApi';
import { bookingApi, type BackendBookingResponse } from '../shared/api/bookingApi';
import type { Machine } from '../entities/machine/types';

const dayLabels = ['Сегодня', 'Завтра', 'Послезавтра'];

export default function Schedule() {
  const { user } = useAuth();
  
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{ machineId: number; time: string; status: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [bookings, setBookings] = useState<BackendBookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // ДОБАВЛЕН ПАРАМЕТР silent ДЛЯ ФОНОВОГО ОБНОВЛЕНИЯ
  const loadData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setError(null);
      const [machinesData, bookingsData] = await Promise.all([
        machineApi.getAll(),
        bookingApi.getAllSchedule()
      ]);
      setMachines(machinesData);
      setBookings(bookingsData);
    } catch {
      if (!silent) setError('Не удалось загрузить расписание.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Первичная загрузка
      loadData();

      // Авто-обновление каждые 5 секунд (без лоадера)
      const interval = setInterval(() => {
        loadData(true);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]); 

  const handleDayChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedDay(newValue);
    setSelectedSlot(null);
    setIsFormOpen(false);
  };

  const handleSlotClick = (machineId: number, time: string, status: string) => {
    setSelectedSlot({ machineId, time, status });
    setBookingError(null);
    setIsFormOpen(true);
  };

  const getDateString = (dayIndex: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    return date.toISOString().split('T')[0];
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const [startTime, endTime] = selectedSlot.time.split('-');
      const dateStr = getDateString(selectedDay);

      await bookingApi.create({
        user_name: user.full_name,
        user_room: user.room,
        machine_id: selectedSlot.machineId,
        start_time: `${dateStr}T${startTime}:00`,
        end_time: `${dateStr}T${endTime}:00`,
      });

      setIsFormOpen(false);
      setSelectedSlot(null);
      setSnackbar({ open: true, message: 'Успешно забронировано!', severity: 'success' });
      
      // После успешной брони обновляем данные "тихо"
      await loadData(true); 
    } catch (err: any) {
      setBookingError(err.message || 'Ошибка при бронировании');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMachineName = machines.find((m) => m.id === selectedSlot?.machineId)?.name ?? '';

  if (isLoading) return <Loader />;
  if (error) return <Box><Alert severity="error" sx={{ mb: 2 }}>{error}</Alert></Box>;

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 2 }}>Расписание</Typography>
      
      <Tabs value={selectedDay} onChange={handleDayChange} sx={{ mb: 4 }}>
        {dayLabels.map((label) => <Tab key={label} label={label} />)}
      </Tabs>

      <Fade in timeout={600}>
        <Stack spacing={3}>
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              day={selectedDay}
              selectedSlot={selectedSlot}
              onSlotClick={handleSlotClick}
              bookings={bookings}
            />
          ))}
        </Stack>
      </Fade>

      <BookingForm
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedSlot(null); }}
        machineName={selectedMachineName}
        dateLabel={`${dayLabels[selectedDay]} (${getDateString(selectedDay)})`}
        timeLabel={selectedSlot?.time ?? ''}
        onConfirm={handleConfirmBooking}
        isSubmitting={isSubmitting}
        error={bookingError}
        isQueue={selectedSlot?.status === 'busy' || selectedSlot?.status === 'queued'}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}