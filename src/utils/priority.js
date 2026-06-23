/**
 * Priority scoring utility for notifications.
 * score = typeWeight + timestamp_ms
 * Weight order: placement > result > event
 */
import logger from './logger';

const weights = {
  placement: 3_000_000_000,
  result: 2_000_000_000,
  event: 1_000_000_000,
};

/**
 * Compute priority score for a single notification.
 */
export const scoreNotification = (item) => {
  const type = (item.type || item.notification_type || '').toLowerCase();
  const ts = new Date(item.createdAt || item.created_at || item.timestamp).getTime() || 0;
  return (weights[type] || 0) + ts;
};

/**
 * Get top N priority notifications.
 * 1. Filter by selected type (if any)
 * 2. Unviewed first
 * 3. Sort descending by score
 * 4. Slice top N
 */
export function getTopN(notifications, viewedIds, n = 10, filterType = '') {
  if (!Array.isArray(notifications) || notifications.length === 0) return [];

  logger.info('priority', 'Priority recalculation', { total: notifications.length, n, filterType });

  let filtered = [...notifications];

  // Filter by type if specified
  if (filterType) {
    filtered = filtered.filter((item) => {
      const t = (item.type || item.notification_type || '').toLowerCase();
      return t === filterType.toLowerCase();
    });
  }

  // Score and tag viewed status
  const scored = filtered.map((item) => ({
    ...item,
    _score: scoreNotification(item),
    _isViewed: viewedIds.has(String(item.id)),
  }));

  // Unviewed first, then sort by score descending
  scored.sort((a, b) => {
    if (a._isViewed !== b._isViewed) return a._isViewed ? 1 : -1;
    return b._score - a._score;
  });

  return scored.slice(0, n);
}
