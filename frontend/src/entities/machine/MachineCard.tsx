import { Card, CardContent, Typography, Stack, Divider, Button } from '@mui/material';
import type { MachineStatus } from './types';
import type { BackendBookingResponse } from '../../shared/api/bookingApi';

const timeSlots = [
  '08:00-10:00', '10:00-12:00', '12:00-14:00',
  '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'
];

interface Props {
  machine: { id: number; name: string };
  day: number;
  selectedSlot: { machineId: number; time: string; status?: string } | null;
  onSlotClick: (machineId: number, time: string, status: string) => void;
  bookings: BackendBookingResponse[];
}

const getDateString = (dayOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
};

const getStatusInfo = (
  machineId: number, 
  time: string, 
  day: number, 
  bookings: BackendBookingResponse[]
) => {
  const targetDate = getDateString(day);
  const [startTime, endTime] = time.split('-');

  const slotBookings = bookings.filter(b => {
    if (b.machine_id !== machineId) return false;
    const bDate = b.start_time.split('T')[0];
    const bStart = b.start_time.split('T')[1].substring(0, 5);
    const bEnd = b.end_time.split('T')[1].substring(0, 5);
    return bDate === targetDate && bStart === startTime && bEnd === endTime;
  });

  const activeCount = slotBookings.filter(b => b.status === 'active').length;
  const queueCount = slotBookings.filter(b => b.status === 'queued').length;

  // ЛОГИКА ЦВЕТА: Если есть очередь — делаем слот желтым (даже если он занят)
  let status: MachineStatus = 'free';
  if (queueCount > 0) {
    status = 'queued';
  } else if (activeCount > 0) {
    status = 'busy';
  }

  return { status, queueCount };
};

const getStatusColor = (status: MachineStatus): 'error' | 'warning' | 'success' => {
  switch (status) {
    case 'busy':   return 'error';
    case 'queued': return 'warning';
    default:       return 'success';
  }
};

export default function MachineCard({ machine, day, selectedSlot, onSlotClick, bookings }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {machine.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
          {timeSlots.map((time) => {
            const { status, queueCount } = getStatusInfo(machine.id, time, day, bookings);
            const isSelected = selectedSlot?.machineId === machine.id && selectedSlot?.time === time;

            // Формируем текст на кнопке
            let label = 'Свободно';
            if (status === 'queued') {
              // Показываем "Очередь (1)", "Очередь (2)" и т.д.
              label = `Очередь (${queueCount})`;
            } else if (status === 'busy') {
              label = 'Занято';
            }

            return (
              <Button
                key={time}
                variant={status === 'free' ? 'outlined' : 'contained'}
                color={getStatusColor(status)}
                onClick={() => onSlotClick(machine.id, time, status)}
                sx={{
                  flexDirection: 'column',
                  py: 1,
                  minWidth: 110,
                  border: isSelected ? '2px solid #fff' : undefined,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {time.split('-')[0]}
                </Typography>
                
                <Typography variant="caption">
                  {label}
                </Typography>
              </Button>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}