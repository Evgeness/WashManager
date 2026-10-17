import { useEffect, useState } from 'react';
import { 
  Box, Card, CardContent, Stack, Typography, 
  Chip, LinearProgress, Divider, Fade, Alert 
} from '@mui/material';
import { 
  LocalLaundryService, AccessTime, CheckCircle 
} from '@mui/icons-material';

import Loader from '../shared/ui/Loader';
import EmptyState from '../shared/ui/EmptyState';
import { machineApi } from '../shared/api/machineApi';
import { bookingApi, type BackendBookingResponse } from '../shared/api/bookingApi';
import { useAuth } from '../shared/context/AuthContext';
import type { Machine } from '../entities/machine/types';
import type { DashboardData } from '../entities/booking/types';


export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Параметр silent для фонового обновления (без мигания лоадера)
  const loadData = async (silent = false) => {
    if (!user) return;
    
    try {
      if (!silent) setIsLoading(true);
      setError(null);

      const [machines, bookings] = await Promise.all([
        machineApi.getAll(),
        bookingApi.getAllSchedule()
      ]);

      // Передаем ID текущего пользователя, чтобы найти ИМЕННО ЕГО бронь
      const computedData = calculateDashboardData(bookings, machines, user.id);
      setData(computedData);
    } catch (e: any) {
      if (!silent) setError(e.message || 'Не удалось загрузить данные.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Автообновление каждые 5 секунд
    const interval = setInterval(() => {
      loadData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);


  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <EmptyState title="Что-то пошло не так" description="Не удалось загрузить данные главной страницы" />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <EmptyState title="Нет данных" description="Пока нечего показать на главной" />
      </Box>
    );
  }


  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h1" sx={{ mb: 1 }}>Главная</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Обзор ваших броней и свободных слотов
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          
          {/* КАРТОЧКА 1: Ближайшая бронь */}
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', display: 'flex' }}>
                    <AccessTime sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Typography variant="h3">Ближайшая бронь</Typography>
                </Stack>
                {data.nearestBooking.machineName !== 'Нет активных броней' && (
                  <Chip label="Активна" color="success" size="small" />
                )}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <LocalLaundryService sx={{ color: 'primary.main' }} />
                <Typography variant="h2">{data.nearestBooking.machineName}</Typography>
              </Stack>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {data.nearestBooking.timeLabel}
              </Typography>

              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">До начала</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {data.nearestBooking.timeUntil}
                </Typography>
              </Box>

              <LinearProgress 
                variant="determinate"
                value={data.nearestBooking.progress}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>

          {/* КАРТОЧКА 2: Свободные слоты сегодня */}
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.main', display: 'flex' }}>
                    <CheckCircle sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Typography variant="h3">Свободные слоты сегодня</Typography>
                </Stack>
                <Chip label={`${data.freeSlots.count} из ${data.freeSlots.total}`} color="success" size="small" />
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h2" sx={{ fontSize: '2.5rem', color: 'success.main' }}>
                  {data.freeSlots.count}
                </Typography>
                <Typography color="text.secondary">свободных окон</Typography>
              </Stack>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                на {data.freeSlots.machines} машинах • ближайшее окно в {data.freeSlots.nextSlot}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                  <Typography variant="caption">Свободно — {data.freeSlots.count}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                  <Typography variant="caption">Занято — {data.freeSlots.busy}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
                  <Typography variant="caption">Очередь — {data.freeSlots.queued}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

        </Stack>
      </Box>
    </Fade>
  );
}

// ===== ОБНОВЛЕННАЯ ФУНКЦИЯ РАСЧЕТА =====
function calculateDashboardData(bookings: BackendBookingResponse[], machines: Machine[], currentUserId: number): DashboardData {
  const now = new Date();

  // 1. Ищем ближайшую АКТИВНУЮ бронь ТОЛЬКО ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
  const userActiveBookings = bookings
    .filter(b => b.user_id === currentUserId && b.status === 'active')
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const nearest = userActiveBookings[0];
  let nearestData: DashboardData['nearestBooking'] = {
    machineName: 'Нет активных броней',
    timeLabel: 'Выберите слот в расписании',
    timeUntil: '—',
    progress: 0,
  };

  if (nearest) {
    const machine = machines.find(m => m.id === nearest.machine_id);
    const start = new Date(nearest.start_time);
    const end = new Date(nearest.end_time);
    
    // Считаем время до начала
    const diffMs = start.getTime() - now.getTime();
    let timeUntil = '';
    let progress = 0;

    if (diffMs < 0) {
      timeUntil = 'Идет сейчас';
      progress = 100;
    } else {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      timeUntil = `${hours} ч ${mins} мин`;
      progress = 50; // Заглушка для прогресс-бара
    }

    nearestData = {
      machineName: machine?.name || `Машина №${nearest.machine_id}`,
      timeLabel: `${start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}, ${start.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})} – ${end.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}`,
      timeUntil: timeUntil,
      progress: progress,
    };
  }

  // 2. Считаем ОБЩУЮ статистику слотов (по всем пользователям)
  const todayStr = now.toISOString().split('T')[0];
  const todaysBookings = bookings.filter(b => b.start_time.startsWith(todayStr));
  
  const busyCount = todaysBookings.filter(b => b.status === 'active').length;
  const queuedCount = todaysBookings.filter(b => b.status === 'queued').length;
  
  const SLOTS_PER_DAY = 7;
  const totalSlots = machines.length * SLOTS_PER_DAY;
  const freeCount = Math.max(0, totalSlots - busyCount - queuedCount);

  return {
    nearestBooking: nearestData,
    freeSlots: {
      count: freeCount,
      total: totalSlots,
      machines: machines.length,
      nextSlot: '14:00',
      busy: busyCount,
      queued: queuedCount,
    },
  };
}