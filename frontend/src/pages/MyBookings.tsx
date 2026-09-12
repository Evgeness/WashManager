import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Tabs, Tab, Stack, Button, Chip 
} from '@mui/material';

// Демонстрационные данные
const mockBookings = [
  {
    id: 1,
    machine: 'Стиральная машина №2',
    date: 'Сегодня',
    time: '18:00 – 19:30',
    status: 'active', // active, queued, completed
  },
  {
    id: 2,
    machine: 'Сушильная машина №1',
    date: 'Завтра',
    time: '10:00 – 11:30',
    status: 'queued',
  },
  {
    id: 3,
    machine: 'Стиральная машина №1',
    date: 'Вчера',
    time: '14:00 – 15:30',
    status: 'completed',
  },
];

export default function MyBookings() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCancel = (id: number) => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      alert(`Бронирование ${id} отменено (демо)`);
    }
  };

  // Фильтрация данных в зависимости от выбранной вкладки
  const filteredBookings = mockBookings.filter((b) =>
    tabValue === 0 
      ? (b.status === 'active' || b.status === 'queued') // Активные
      : b.status === 'completed'                         // История
  );

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
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Активные" />
        <Tab label="История" />
      </Tabs>

      <Stack spacing={2}>
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                У вас пока нет бронирований в этой категории
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: 2 
                }}
              >
                <Box>
                  <Typography variant="h3">{booking.machine}</Typography>
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
    </Box>
  );
}