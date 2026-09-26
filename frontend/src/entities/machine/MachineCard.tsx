import { Card, CardContent, Typography, Stack, Divider, Button } from '@mui/material';
import type {MachineStatus } from './types';
import { timeSlots } from '../../shared/api/mockApi';

interface Props {
  machine: { id: number; name: string };
  day: number;
  selectedSlot: { machineId: number; time: string } | null;
  onSlotClick: (machineId: number, time: string, status: string) => void;
}

// Вспомогательные функции для статуса
const getStatus = (machineId: number, time: string, day: number): MachineStatus => {
  if (day === 0) {
    if (machineId === 1 && time === '10:00-12:00') return 'busy';
    if (machineId === 1 && time === '12:00-14:00') return 'queued';
    if (machineId === 2 && time === '08:00-10:00') return 'busy';
    if (machineId === 3 && time === '18:00-20:00') return 'busy';
  }
  return 'free';
};

const getStatusColor = (status: MachineStatus): 'error' | 'warning' | 'success' => {
  switch (status) {
    case 'busy':   return 'error';
    case 'queued': return 'warning';
    default:       return 'success';
  }
};

const getStatusLabel = (status: MachineStatus): string => {
  switch (status) {
    case 'busy':   return 'Занято';
    case 'queued': return 'Очередь';
    case 'broken': return 'Сломано';
    default:       return 'Свободно';
  }
};


export default function MachineCard({ machine, day, selectedSlot, onSlotClick }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {machine.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
          {timeSlots.map((time) => {
            const status = getStatus(machine.id, time, day);
            const isSelected =
              selectedSlot?.machineId === machine.id && selectedSlot?.time === time;

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
                  {getStatusLabel(status)}
                </Typography>
              </Button>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}