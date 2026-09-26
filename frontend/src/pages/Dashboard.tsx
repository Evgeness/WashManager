// ===== ИМПОРТЫ =====
import { useEffect, useState } from 'react';
import { 
  Box, Card, CardContent, Stack, Typography, 
  Chip, LinearProgress, Divider, Fade, Alert 
} from '@mui/material';

import { 
  LocalLaundryService,   // Иконка стиральной машины
  AccessTime,            // Иконка часов
  CheckCircle            // Иконка галочки
} from '@mui/icons-material';

// ===== ИМПОРТЫ ИЗ НОВОЙ СТРУКТУРЫ FSD =====
import Loader from '../shared/ui/Loader';
import EmptyState from '../shared/ui/EmptyState';
import { fetchDashboardData } from '../shared/api/mockApi';
import type { DashboardData } from '../entities/booking/types';


export default function Dashboard() {
  // ===== СОСТОЯНИЯ (STATE) =====
  // Данные, загруженные с "сервера"
  const [data, setData] = useState<DashboardData | null>(null);

  // Идёт ли загрузка
  const [isLoading, setIsLoading] = useState(true);

  // Ошибка загрузки
  const [error, setError] = useState<string | null>(null);


  // ===== ЗАГРУЗКА ДАННЫХ ПРИ МОНТИРОВАНИИ =====
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchDashboardData();
        setData(result);
      } catch (e) {
        setError('Не удалось загрузить данные. Попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);


  // ===== СОСТОЯНИЕ 1: ЗАГРУЗКА =====
  if (isLoading) {
    return <Loader />;
  }


  // ===== СОСТОЯНИЕ 2: ОШИБКА =====
  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <EmptyState 
          title="Что-то пошло не так" 
          description="Не удалось загрузить данные главной страницы" 
        />
      </Box>
    );
  }


  // ===== СОСТОЯНИЕ 3: ПУСТО (нет данных) =====
  if (!data) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <EmptyState 
          title="Нет данных" 
          description="Пока нечего показать на главной" 
        />
      </Box>
    );
  }


  // ===== СОСТОЯНИЕ 4: УСПЕХ — показываем данные =====
  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

        {/* ===== ЗАГОЛОВОК СТРАНИЦЫ ===== */}
        <Typography variant="h1" sx={{ mb: 1 }}>
          Главная
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Обзор ваших броней и свободных слотов
        </Typography>

        {/* ===== ДВЕ КАРТОЧКИ ===== 
            direction={{ xs: 'column', md: 'row' }} — на мобилке колонка,
            на десктопе (>900px) — ряд.
            spacing={3} — отступ между карточками. */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={3} 
          sx={{ mb: 4 }}
        >
          
          {/* ===== КАРТОЧКА 1: Ближайшая бронь ===== */}
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              
              {/* Заголовок карточки: иконка + текст + статус */}
              <Stack 
                direction="row" 
                sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccessTime sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Typography variant="h3">Ближайшая бронь</Typography>
                </Stack>
                
                <Chip label="Активна" color="success" size="small" />
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Название машины — данные из API */}
              <Stack 
                direction="row" 
                spacing={1.5} 
                sx={{ alignItems: 'center', mb: 1 }}
              >
                <LocalLaundryService sx={{ color: 'primary.main' }} />
                <Typography variant="h2">
                  {data.nearestBooking.machineName}
                </Typography>
              </Stack>

              {/* Время брони — данные из API */}
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {data.nearestBooking.timeLabel}
              </Typography>

              {/* Блок "До начала" */}
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  До начала
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {data.nearestBooking.timeUntil}
                </Typography>
              </Box>

              {/* Прогресс-бар */}
              <LinearProgress 
                variant="determinate"
                value={data.nearestBooking.progress}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>


          {/* ===== КАРТОЧКА 2: Свободные слоты сегодня ===== */}
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              
              <Stack 
                direction="row" 
                sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Typography variant="h3">Свободные слоты сегодня</Typography>
                </Stack>
                <Chip 
                  label={`${data.freeSlots.count} из ${data.freeSlots.total}`} 
                  color="success" 
                  size="small" 
                />
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Большая цифра — количество свободных окон */}
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h2" sx={{ fontSize: '2.5rem', color: 'success.main' }}>
                  {data.freeSlots.count}
                </Typography>
                <Typography color="text.secondary">свободных окон</Typography>
              </Stack>

              {/* Дополнительная подпись */}
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                на {data.freeSlots.machines} машинах • ближайшее окно в {data.freeSlots.nextSlot}
              </Typography>

              {/* Легенда: цветные точки со значениями */}
              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                  <Typography variant="caption">
                    Свободно — {data.freeSlots.count}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                  <Typography variant="caption">
                    Занято — {data.freeSlots.busy}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
                  <Typography variant="caption">
                    Очередь — {data.freeSlots.queued}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

        </Stack>
      </Box>
    </Fade>
  );
}