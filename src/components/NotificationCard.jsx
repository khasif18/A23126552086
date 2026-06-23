import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import logger from '../utils/logger';

const TYPE_COLORS = {
  placement: 'success',
  result: 'warning',
  event: 'info',
};

function getChipColor(type) {
  if (!type) return 'default';
  return TYPE_COLORS[String(type).toLowerCase().trim()] || 'default';
}

function NotificationCard({ notification, isViewed, onView }) {
  const {
    id,
    type,
    notification_type,
    message,
    title,
    timestamp,
    created_at,
    date,
  } = notification || {};

  const displayType = type || notification_type || 'unknown';
  const displayMessage = message || title || 'No content';
  const displayTime = timestamp || created_at || date || '';

  const handleClick = () => {
    if (!isViewed && id) {
      logger.info('NotificationCard', 'Notification viewed by user', { id, type: displayType });
      onView(id);
    }
  };

  return (
    <Card
      sx={{
        mb: 1.5,
        borderLeft: isViewed ? '4px solid transparent' : '4px solid #1976d2',
        opacity: isViewed ? 0.75 : 1,
        backgroundColor: isViewed ? '#fafafa' : '#fff',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: isViewed ? 400 : 600 }}>
                {displayMessage}
              </Typography>
              {displayTime && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {new Date(displayTime).toLocaleString()}
                </Typography>
              )}
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={displayType}
                color={getChipColor(displayType)}
                size="small"
                variant="outlined"
              />
              {isViewed ? (
                <VisibilityIcon fontSize="small" color="disabled" />
              ) : (
                <FiberNewIcon fontSize="small" color="primary" />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default React.memo(NotificationCard);
