import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Tabs, Tab, Fade, Alert } from '@mui/material';
import BookingForm from '../features/booking-machine/BookingForm';
import MachineCard from '../entities/machine/MachineCard';
import Loader from '../shared/ui/Loader';
import EmptyState from '../shared/ui/EmptyState';
import { machines, dayLabels } from '../shared/api/mockApi';


export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{ machineId: number; time: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ===== Состояния загрузки / ошибки / пустоты =====
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<typeof machines | null>(null);

  useEffect(() => {
    // Имитация загрузки
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await new Promise((r) => setTimeout(r, 600));
        if (machines.length === 0) {
          setData([]);
        } else {
          setData(machines);
        }
      } catch {
        setError('Не удалось загрузить расписание');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleDayChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedDay(newValue);
    setSelectedSlot(null);
    setIsFormOpen(false);
  };

  const handleSlotClick = (machineId: number, time: string, status: string) => {
    if (status === 'free') {
      setSelectedSlot({ machineId, time });
      setIsFormOpen(true);
    } else {
      alert('Этот слот уже занят или вы в очереди на него.');
    }
  };

  const selectedMachineName =
    machines.find((m) => m.id === selectedSlot?.machineId)?.name ?? '';

  // ===== СОСТОЯНИЕ 1: ЗАГРУЗКА =====
  if (isLoading) {
    return <Loader />;
  }

  // ===== СОСТОЯНИЕ 2: ОШИБКА =====
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <EmptyState title="Ошибка" description="Попробуйте обновить страницу" />
      </Box>
    );
  }

  // ===== СОСТОЯНИЕ 3: ПУСТО =====
  if (!data || data.length === 0) {
    return (
      <Box>
        <Typography variant="h1" sx={{ mb: 2 }}>Расписание</Typography>
        <EmptyState title="Машин пока нет" description="Обратитесь к администратору общежития" />
      </Box>
    );
  }

  // ===== СОСТОЯНИЕ 4: УСПЕХ =====
  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 2 }}>Расписание</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Выберите свободный слот для бронирования
      </Typography>

      <Tabs value={selectedDay} onChange={handleDayChange} sx={{ mb: 4 }}>
        {dayLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      <Fade in timeout={600}>
        <Stack spacing={3}>
          {data.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              day={selectedDay}
              selectedSlot={selectedSlot}
              onSlotClick={handleSlotClick}
            />
          ))}
        </Stack>
      </Fade>

      <BookingForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSlot(null);
        }}
        machineName={selectedMachineName}
        dateLabel={dayLabels[selectedDay]}
        timeLabel={selectedSlot?.time ?? ''}
        onConfirm={() => {
          alert(
            `Бронь подтверждена!\n` +
            `Машина: ${selectedMachineName}\n` +
            `Дата: ${dayLabels[selectedDay]}\n` +
            `Время: ${selectedSlot?.time}`
          );
          setIsFormOpen(false);
          setSelectedSlot(null);
        }}
      />
    </Box>
  );
}