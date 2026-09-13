// ===== ИМПОРТЫ =====
import { 
  Box, Card, CardContent, Stack, Typography, 
  Chip, LinearProgress, Divider 
} from '@mui/material';
// Chip — маленький бейдж-статус ("Активна")
// LinearProgress — горизонтальный прогресс-бар
// Divider — разделительная линия

import { 
  LocalLaundryService,   // Иконка стиральной машины
  AccessTime,            // Иконка часов
  CheckCircle            // Иконка галочки
} from '@mui/icons-material';

export default function Dashboard() {
  return (
    // Общий контейнер: ограничиваем ширину 1200px и центрируем
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

      {/* ===== ДВЕ КАРТОЧКИ ===== 
          direction={{ xs: 'column', md: 'row' }} — на мобилке колонка,
          на десктопе (>900px) — ряд.
          spacing={3} — отступ между карточками. */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={3} 
        sx={{ mb: 4 }}      // Отступ снизу
      >
        
        {/* ===== КАРТОЧКА 1: Ближайшая бронь ===== */}
        {/* flex: 1 — обе карточки занимают равную ширину */}
        <Card sx={{ flex: 1 }}>
          {/* p: 3 — внутренний отступ 24px */}
          <CardContent sx={{ p: 3 }}>
            
            {/* Заголовок карточки: иконка + текст + статус */}
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {/* Квадратная плашка с иконкой */}
                <Box 
                  sx={{ 
                    p: 1,                     // Внутренний отступ вокруг иконки
                    borderRadius: 2,          // Скруглённые углы
                    bgcolor: 'primary.main',  // Синий фон
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTime sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
                <Typography variant="h3">Ближайшая бронь</Typography>
              </Stack>
              
              {/* Бейдж-статус */}
              <Chip label="Активна" color="success" size="small" />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Название машины с иконкой */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
              <LocalLaundryService sx={{ color: 'primary.main' }} />
              <Typography variant="h2">Стиральная машина №3</Typography>
            </Stack>

            {/* Время брони */}
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Сегодня, 18:00 – 19:30
            </Typography>

            {/* Блок "До начала — 2 ч 15 мин" */}
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                До начала
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                2 ч 15 мин
              </Typography>
            </Box>

            {/* Прогресс-бар: 35% — сколько времени прошло/осталось */}
            <LinearProgress 
              variant="determinate"      // Значение задаётся вручную
              value={35}                 // 35% заполнения
              sx={{ height: 6, borderRadius: 3 }}
            />
          </CardContent>
        </Card>

        {/* ===== КАРТОЧКА 2: Свободные слоты сегодня ===== */}
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {/* Плашка с иконкой галочки — зелёная */}
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: 'success.main',   // Зелёный фон
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
                <Typography variant="h3">Свободные слоты сегодня</Typography>
              </Stack>
              <Chip label="12 из 28" color="success" size="small" />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Большая цифра "12" + подпись */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h2" sx={{ fontSize: '2.5rem', color: 'success.main' }}>
                12
              </Typography>
              <Typography color="text.secondary">свободных окон</Typography>
            </Stack>

            {/* Дополнительная подпись */}
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              на 4 машинах • ближайшее окно в 14:00
            </Typography>

            {/* Легенда: цветные точки со значениями */}
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              {/* Свободно */}
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Typography variant="caption">Свободно — 12</Typography>
              </Stack>
              {/* Занято */}
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                <Typography variant="caption">Занято — 10</Typography>
              </Stack>
              {/* Очередь */}
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
                <Typography variant="caption">Очередь — 6</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

      </Stack>
    </Box>
  );
}