import { Box, Typography } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface Props {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ 
  title = 'Здесь пока пусто', 
  description = 'Данных нет', 
  action 
}: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2, textAlign: 'center' }}>
      <InboxOutlined sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
      <Typography variant="h3">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action}
    </Box>
  );
}