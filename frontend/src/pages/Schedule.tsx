import { useState } from 'react';   // Хук состояния
import { 
  Box, Typography, Card, CardContent, Stack, Tabs, Tab, Button, Divider 
} from '@mui/material';

// ===== ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ =====
// Позже они будут заменены на данные из API.

// Список машин
const machines = [
  { id: 1, name: 'Стиральная машина №1' },
  { id: 2, name: 'Стиральная машина №2' },
  { id: 3, name: 'Сушильная машина №1' },
];

// Возможные временные слоты
const timeSlots = [
  '08:00-10:00', '10:00-12:00', '12:00-14:00', 
  '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'
];

export default function Schedule() {
  // Стейт: индекс выбранного дня (0 — сегодня, 1 — завтра, 2 — послезавтра)
  const [selectedDay, setSelectedDay] = useState(0);

  // Стейт: выбранный пользователем слот (какая машина + время)
  const [selectedSlot, setSelectedSlot] = useState<{ machineId: number, time: string } | null>(null);

  // Обработчик переключения дня
  const handleDayChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedDay(newValue);
    setSelectedSlot(null);      // Сбрасываем выбор при смене дня
  };

  // Обработчик клика по слоту
  const handleSlotClick = (machineId: number, time: string, status: string) => {
    if (status === 'free') {
      setSelectedSlot({ machineId, time });
      // В реальном приложении здесь было бы модальное окно подтверждения
      alert(`Вы выбрали: Машина ${machineId}, Время: ${time}. Нажмите ОК для подтверждения.`);
    } else {
      alert('Этот слот уже занят или вы в очереди на него.');
    }
  };

  // ===== ЛОГИКА СТАТУСА СЛОТА =====
  // Демонстрационная: для "сегодня" некоторые слоты помечены как занятые/очередь.
  // В реальном приложении статус придёт с backend.
  const getStatus = (machineId: number, time: string, day: number) => {
    if (day === 0) { // "Сегодня"
      if (machineId === 1 && time === '10:00-12:00') return 'busy';
      if (machineId === 1 && time === '12:00-14:00') return 'queue';
      if (machineId === 2 && time === '08:00-10:00') return 'busy';
      if (machineId === 3 && time === '18:00-20:00') return 'busy';
    }
    return 'free';   // По умолчанию — свободно
  };

  // Возвращаем цвет MUI для статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'busy':  return 'error';    // Красный
      case 'queue': return 'warning';  // Жёлтый
      default:      return 'success';  // Зелёный
    }
  };

  // Возвращаем русскую подпись для статуса
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'busy':  return 'Занято';
      case 'queue': return 'Очередь';
      default:      return 'Свободно';
    }
  };

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 2 }}>Расписание</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Выберите свободный слот для бронирования
      </Typography>

      {/* ===== ВКЛАДКИ ПО ДНЯМ ===== 
          value + onChange — контролируемый компонент. 
          Tabs — стандартный компонент MUI, внутри — Tab. */}
      <Tabs value={selectedDay} onChange={handleDayChange} sx={{ mb: 4 }}>
        <Tab label="Сегодня" />
        <Tab label="Завтра" />
        <Tab label="15 июня" />
      </Tabs>

      {/* ===== СПИСОК МАШИН ===== 
          Для каждой машины — отдельная карточка со слотами. */}
      <Stack spacing={3}>
        {machines.map((machine) => (
          <Card key={machine.id}>
            <CardContent>
              <Typography variant="h3" sx={{ mb: 2 }}>
                {machine.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* Слоты машины: flex-wrap позволяет переносить кнопки на новую строку.
                  useFlexGap — MUI-специфичный проп для правильных отступов между строками. */}
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                {timeSlots.map((time) => {
                  // Определяем статус этого слота
                  const status = getStatus(machine.id, time, selectedDay);
                  
                  // Проверяем, выбран ли этот слот пользователем
                  const isSelected = selectedSlot?.machineId === machine.id && selectedSlot?.time === time;
                  
                  return (
                    <Button
                      key={time}
                      // Свободные — outlined (без заливки), занятые/очередь — contained (с заливкой)
                      variant={status === 'free' ? 'outlined' : 'contained'}
                      // Приводим тип к any, т.к. MUI ожидает строгий union цветов
                      color={getStatusColor(status) as any}
                      onClick={() => handleSlotClick(machine.id, time, status)}
                      sx={{ 
                        flexDirection: 'column',  // Иконка+текст вертикально
                        py: 1, 
                        minWidth: 110,
                        // Белая рамка, если слот выбран
                        border: isSelected ? '2px solid #fff' : undefined,
                      }}
                    >
                      {/* Время начала */}
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {time.split('-')[0]}
                      </Typography>
                      {/* Статус */}
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