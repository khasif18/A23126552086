import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Pagination, Snackbar, Alert } from '@mui/material';
import ToolbarFilters from '../components/ToolbarFilters';
import NotificationList from '../components/NotificationList';
import { fetchNotifications } from '../services/notificationApi';
import { markAsViewed, getAllViewedIds } from '../utils/viewedStorage';
import logger from '../utils/logger';

function AllNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState('');
  const [total, setTotal] = useState(0);
  const [viewedIds, setViewedIds] = useState(getAllViewedIds());
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchNotifications({
        page,
        limit,
        notification_type: type || undefined,
      });
      setNotifications(result.notifications || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, type]);

  useEffect(() => {
    logger.info('AllNotificationsPage', 'Page navigation / params changed, loading data', { page, limit, type });
    loadNotifications();
  }, [loadNotifications]);

  const handlePageChange = (_event, newPage) => {
    logger.info('AllNotificationsPage', 'Page changed', { from: page, to: newPage });
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page on limit change
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setPage(1); // Reset to first page on filter change
  };

  const handleView = (id) => {
    markAsViewed(id);
    setViewedIds(getAllViewedIds());
    setSnackbar({ open: true, message: 'Notification marked as read' });
  };

  const handleRetry = () => {
    logger.info('AllNotificationsPage', 'Retry clicked');
    loadNotifications();
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        All Notifications
      </Typography>

      <ToolbarFilters
        type={type}
        onTypeChange={handleTypeChange}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        viewedIds={viewedIds}
        onView={handleView}
      />

      {!loading && !error && notifications.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

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

export default AllNotificationsPage;
