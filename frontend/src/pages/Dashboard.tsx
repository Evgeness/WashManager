import { 
  Box, Card, CardContent, Stack, Typography, 
  Chip, LinearProgress, Divider 
} from '@mui/material';
import { 
  LocalLaundryService, 
  AccessTime, 
  CheckCircle 
} from '@mui/icons-material';

export default function Dashboard() {

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

      {/* ===== ДВЕ КАРТОЧКИ С АКТУАЛЬНЫМИ ДАННЫМИ ===== */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={3} 
        sx={{ mb: 4 }}
      >
        
        {/* КАРТОЧКА 1: Ближайшая бронь */}
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
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

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
              <LocalLaundryService sx={{ color: 'primary.main' }} />
              <Typography variant="h2">Стиральная машина №3</Typography>
            </Stack>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Сегодня, 18:00 – 19:30
            </Typography>

            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                До начала
              </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              2 ч 15 мин
            </Typography>
            </Box>

            <LinearProgress 
              variant="determinate" 
              value={35} 
              sx={{ height: 6, borderRadius: 3 }}
            />
          </CardContent>
        </Card>

        {/* КАРТОЧКА 2: Свободные слоты сегодня */}
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
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
              <Chip label="12 из 28" color="success" size="small" />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h2" sx={{ fontSize: '2.5rem', color: 'success.main' }}>
                12
              </Typography>
              <Typography color="text.secondary">свободных окон</Typography>
            </Stack>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              на 4 машинах • ближайшее окно в 14:00
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Typography variant="caption">Свободно — 12</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                <Typography variant="caption">Занято — 10</Typography>
              </Stack>
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