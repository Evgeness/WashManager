import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loader() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
      <CircularProgress />
      <Typography color="text.secondary">Загрузка данных...</Typography>
    </Box>
  );
}