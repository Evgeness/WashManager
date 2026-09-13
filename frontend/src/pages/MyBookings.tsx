import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Tabs, Tab, Stack, Button, Chip 
} from '@mui/material';

// ===== ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ =====
// Каждая бронь содержит: id, машину, дату, время и статус.
// Статусы: 'active' — активна, 'queued' — в очереди, 'completed' — завершена.
const mockBookings = [
  { id: 1, machine: 'Стиральная машина №2', date: 'Сегодня', time: '18:00 – 19:30', status: 'active' },
  { id: 2, machine: 'Сушильная машина №1',   date: 'Завтра',  time: '10:00 – 11:30', status: 'queued' },
  { id: 3, machine: 'Стиральная машина №1', date: 'Вчера',   time: '14:00 – 15:30', status: 'completed' },
];

export default function MyBookings() {
  // Стейт текущей вкладки: 0 — Активные, 1 — История
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Обработчик отмены брони
  const handleCancel = (id: number) => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      alert(`Бронирование ${id} отменено (демо)`);
    }
  };

  // ===== ФИЛЬТРАЦИЯ ПО ВКЛАДКАМ =====
  // На вкладке "Активные" — только active и queued.
  // На вкладке "История" — только completed.
  const filteredBookings = mockBookings.filter((b) =>
    tabValue === 0 
      ? (b.status === 'active' || b.status === 'queued')
      : b.status === 'completed'
  );

  // Функция возвращает Chip в зависимости от статуса
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="Подтверждено" color="success" />;
      case 'queued':
        return <Chip label="В очереди" color="warning" />;
      case 'completed':
        return <Chip label="Завершено" color="default" variant="outlined" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h1" sx={{ mb: 2 }}>Мои бронирования</Typography>
      
      {/* ===== ВКЛАДКИ ===== */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Активные" />
        <Tab label="История" />
      </Tabs>

      {/* ===== СПИСОК БРОНЕЙ ===== */}
      <Stack spacing={2}>
        {/* Если нет броней — показываем заглушку */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                У вас пока нет бронирований в этой категории
              </Typography>
            </CardContent>
          </Card>
        ) : (
          // Иначе — рендерим карточки броней
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent 
                sx={{ 
                  display: 'flex',                // Раскладка: слева инфо, справа действия
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',               // На узких экранах перенос
                  gap: 2 
                }}
              >
                {/* Левая часть: машина + дата/время */}
                <Box>
                  <Typography variant="h3">{booking.machine}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {booking.date} • {booking.time}
                  </Typography>
                </Box>
                
                {/* Правая часть: статус + кнопка отмены */}
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  {getStatusChip(booking.status)}
                  
                  {/* Кнопка отмены показывается ТОЛЬКО на вкладке "Активные" */}
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
    </Box>
  );
}