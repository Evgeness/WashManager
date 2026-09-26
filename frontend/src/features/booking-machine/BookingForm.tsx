import {
  Box, Button, Stack, Typography, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { 
  Close, LocalLaundryService, AccessTime, CalendarToday 
} from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  machineName: string;
  dateLabel: string;
  timeLabel: string;
  onConfirm: () => void;
}

export default function BookingForm({
  open, onClose, machineName, dateLabel, timeLabel, onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      {/* ===== ЗАГОЛОВОК ===== */}
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        Подтверждение брони
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* ===== БЛОК С ИНФОРМАЦИЕЙ О СЛОТЕ ===== */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            mb: 2,
          }}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <LocalLaundryService sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Машина
              </Typography>
            </Stack>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {machineName}
            </Typography>

            <Divider />

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{dateLabel}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{timeLabel}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* ===== ТЕКСТ-ПОДТВЕРЖДЕНИЕ ===== */}
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          Вы уверены, что хотите забронировать этот слот?
        </Typography>
      </DialogContent>

      {/* ===== КНОПКИ ===== */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Отмена
        </Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
}