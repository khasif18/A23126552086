/**
 * Viewed notifications persistence via localStorage.
 */
import logger from './logger';

const STORAGE_KEY = 'viewed_notification_ids';

function getViewedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      logger.warn('viewedStorage', 'Invalid viewed IDs format in localStorage, resetting');
      return new Set();
    }
    return new Set(parsed);
  } catch (err) {
    logger.error('viewedStorage', 'Failed to read viewed IDs from localStorage', { error: err.message });
    return new Set();
  }
}

function saveViewedIds(idSet) {
  try {
    const arr = Array.from(idSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (err) {
    logger.error('viewedStorage', 'Failed to save viewed IDs to localStorage', { error: err.message });
  }
}

export function isViewed(id) {
  return getViewedIds().has(String(id));
}

export function markAsViewed(id) {
  const ids = getViewedIds();
  const strId = String(id);
  if (!ids.has(strId)) {
    ids.add(strId);
    saveViewedIds(ids);
    logger.info('viewedStorage', 'Notification marked as viewed', { id: strId });
  }
}

export function getAllViewedIds() {
  return getViewedIds();
}
