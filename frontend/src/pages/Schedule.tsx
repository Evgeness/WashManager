import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Stack, Tabs, Tab, Button, Divider 
} from '@mui/material';

// Демонстрационные данные
const machines = [
  { id: 1, name: 'Стиральная машина №1' },
  { id: 2, name: 'Стиральная машина №2' },
  { id: 3, name: 'Сушильная машина №1' },
];

const timeSlots = [
  '08:00-10:00', '10:00-12:00', '12:00-14:00', 
  '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'
];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{ machineId: number, time: string } | null>(null);

  const handleDayChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedDay(newValue);
    setSelectedSlot(null);
  };

  const handleSlotClick = (machineId: number, time: string, status: string) => {
    if (status === 'free') {
      setSelectedSlot({ machineId, time });
      // В реальном приложении здесь будет модальное окно подтверждения
      alert(`Вы выбрали: Машина ${machineId}, Время: ${time}. Нажмите ОК для подтверждения.`);
    } else {
      alert('Этот слот уже занят или вы в очереди на него.');
    }
  };

  // Логика для демонстрации разных статусов
  const getStatus = (machineId: number, time: string, day: number) => {
    if (day === 0) { // "Сегодня"
      if (machineId === 1 && time === '10:00-12:00') return 'busy';
      if (machineId === 1 && time === '12:00-14:00') return 'queue';
      if (machineId === 2 && time === '08:00-10:00') return 'busy';
      if (machineId === 3 && time === '18:00-20:00') return 'busy';
    }
    return 'free';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'busy': return 'error';     // Красный
      case 'queue': return 'warning';  // Желтый
      default: return 'success';       // Зеленый
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'busy': return 'Занято';
      case 'queue': return 'Очередь';
      default: return 'Свободно';
    }
  };

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 2 }}>Расписание</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Выберите свободный слот для бронирования
      </Typography>

      <Tabs value={selectedDay} onChange={handleDayChange} sx={{ mb: 4 }}>
        <Tab label="Сегодня" />
        <Tab label="Завтра" />
        <Tab label="15 июня" />
      </Tabs>

      <Stack spacing={3}>
        {machines.map((machine) => (
          <Card key={machine.id}>
            <CardContent>
              <Typography variant="h3" sx={{ mb: 2 }}>
                {machine.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                {timeSlots.map((time) => {
                  const status = getStatus(machine.id, time, selectedDay);
                  const isSelected = selectedSlot?.machineId === machine.id && selectedSlot?.time === time;
                  
                  return (
                    <Button
                      key={time}
                      variant={status === 'free' ? 'outlined' : 'contained'}
                      color={getStatusColor(status) as any}
                      onClick={() => handleSlotClick(machine.id, time, status)}
                      sx={{ 
                        flexDirection: 'column', 
                        py: 1, 
                        minWidth: 110,
                        border: isSelected ? '2px solid #fff' : undefined // Выделение выбранного слота
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
        ))}
      </Stack>
    </Box>
  );
}