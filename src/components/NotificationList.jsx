import React from 'react';
import { Box, Typography, Alert, Button, Skeleton, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InboxIcon from '@mui/icons-material/Inbox';
import NotificationCard from './NotificationCard';
import logger from '../utils/logger';

function NotificationList({ notifications, loading, error, onRetry, viewedIds, onView }) {
  // Loading state
  if (loading) {
    return (
      <Box>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={80}
            sx={{ mb: 1.5 }}
            animation="wave"
          />
        ))}
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => {
                logger.info('NotificationList', 'Retry clicked after error');
                onRetry();
              }}
            >
              Retry
            </Button>
          )
        }
      >
        {error}
      </Alert>
    );
  }

  // Empty state
  if (!notifications || notifications.length === 0) {
    logger.info('NotificationList', 'Empty state shown');
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
        <InboxIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
        <Typography variant="h6" color="text.secondary">
          No notifications found
        </Typography>
        {onRetry && (
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRetry}>
            Refresh
          </Button>
        )}
      </Stack>
    );
  }

  return (
    <Box>
      {notifications.map((notification) => {
        const id = notification?.id;
        const isViewed = id ? viewedIds.has(String(id)) : true;
        return (
          <NotificationCard
            key={id || Math.random()}
            notification={notification}
            isViewed={isViewed}
            onView={onView}
          />
        );
      })}
    </Box>
  );
}

export default React.memo(NotificationList);
