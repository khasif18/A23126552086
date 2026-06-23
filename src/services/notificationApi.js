/**
 * Notification API service.
 * Base URL: http://4.224.186.213/evaluation-service/notifications
 */
import logger from '../utils/logger';

const BASE_URL = 'http://4.224.186.213/evaluation-service/notifications';

/**
 * Fetch notifications with pagination and optional type filter.
 * @param {Object} params
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.limit - Items per page
 * @param {string} [params.notification_type] - Filter by type
 * @returns {Promise<Object>} API response with notifications array and metadata
 */
export async function fetchNotifications({ page = 1, limit = 10, notification_type } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (notification_type) {
    params.set('notification_type', notification_type);
  }

  const url = `${BASE_URL}?${params.toString()}`;

  logger.info('notificationApi', 'API request started', { url, page, limit, notification_type });

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      logger.error('notificationApi', 'API request failed with status', {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info('notificationApi', 'API request successful', {
      page,
      limit,
      resultCount: Array.isArray(data?.notifications) ? data.notifications.length : 'unknown',
    });

    return normalizeResponse(data);
  } catch (err) {
    if (err.message.startsWith('API error:')) {
      throw err;
    }
    logger.error('notificationApi', 'API request network failure', { error: err.message });
    throw new Error(`Network error: ${err.message}`);
  }
}

/**
 * Normalize the API response to a consistent shape.
 * Adapts defensively if the response shape differs from expected.
 */
function normalizeResponse(data) {
  try {
    // Expected shape: { notifications: [...], page, limit, total, ... }
    // Handle if data itself is an array
    if (Array.isArray(data)) {
      logger.warn('notificationApi', 'Response is a raw array, wrapping');
      return { notifications: data, total: data.length, page: 1 };
    }

    // Handle if notifications key exists
    if (data && Array.isArray(data.notifications)) {
      return {
        notifications: data.notifications,
        total: data.total || data.totalCount || data.notifications.length,
        page: data.page || 1,
      };
    }

    // Handle if data key exists instead
    if (data && Array.isArray(data.data)) {
      logger.warn('notificationApi', 'Response uses "data" key instead of "notifications"');
      return {
        notifications: data.data,
        total: data.total || data.totalCount || data.data.length,
        page: data.page || 1,
      };
    }

    // Handle if results key exists
    if (data && Array.isArray(data.results)) {
      logger.warn('notificationApi', 'Response uses "results" key');
      return {
        notifications: data.results,
        total: data.total || data.totalCount || data.results.length,
        page: data.page || 1,
      };
    }

    logger.error('notificationApi', 'Unexpected response shape, returning empty', { keys: Object.keys(data || {}) });
    return { notifications: [], total: 0, page: 1 };
  } catch (err) {
    logger.error('notificationApi', 'Error normalizing response', { error: err.message });
    return { notifications: [], total: 0, page: 1 };
  }
}
