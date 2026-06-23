import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Snackbar, Alert, Chip, Stack } from '@mui/material';
import ToolbarFilters from '../components/ToolbarFilters';
import NotificationList from '../components/NotificationList';
import { fetchNotifications } from '../services/notificationApi';
import { markAsViewed, getAllViewedIds } from '../utils/viewedStorage';
import { getTopN } from '../utils/priority';
import logger from '../utils/logger';

const TOP_N_OPTIONS = [10, 15, 20, 25, 50];

function PriorityNotificationsPage() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);
  const [type, setType] = useState('');
  const [viewedIds, setViewedIds] = useState(getAllViewedIds());
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const loadAllNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch a large batch for priority calculation
      const result = await fetchNotifications({ page: 1, limit: 100 });
      setAllNotifications(result.notifications || []);
    } catch (err) {
      setError(err.message);
      setAllNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    logger.info('PriorityNotificationsPage', 'Loading notifications for priority view');
    loadAllNotifications();
  }, [loadAllNotifications]);

  const priorityNotifications = useMemo(() => {
    if (!allNotifications.length) return [];
    return getTopN(allNotifications, viewedIds, topN, type);
  }, [allNotifications, viewedIds, topN, type]);

  const handleTopNChange = (newN) => {
    logger.info('PriorityNotificationsPage', 'Top N changed', { from: topN, to: newN });
    setTopN(newN);
  };

  const handleTypeChange = (newType) => {
    logger.info('PriorityNotificationsPage', 'Type filter changed', { to: newType });
    setType(newType);
  };

  const handleView = (id) => {
    markAsViewed(id);
    setViewedIds(getAllViewedIds());
    setSnackbar({ open: true, message: 'Notification marked as read' });
  };

  const handleRetry = () => {
    logger.info('PriorityNotificationsPage', 'Retry clicked');
    loadAllNotifications();
  };

  const unviewedCount = priorityNotifications.filter((n) => !n._isViewed).length;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Priority Notifications
        </Typography>
        {!loading && !error && (
          <Chip
            label={`${unviewedCount} unread`}
            color="primary"
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      <ToolbarFilters
        type={type}
        onTypeChange={handleTypeChange}
        limit={topN}
        onLimitChange={handleTopNChange}
        limitOptions={TOP_N_OPTIONS}
      />

      <NotificationList
        notifications={priorityNotifications}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        viewedIds={viewedIds}
        onView={handleView}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PriorityNotificationsPage;
