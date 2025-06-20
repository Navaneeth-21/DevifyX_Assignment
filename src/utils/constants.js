module.exports = {
  EXPORT_STATUSES: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },
  DATA_CATEGORIES: ['profile', 'settings', 'activityLogs'],
  AUDIT_ACTIONS: {
    EXPORT_REQUEST: 'export_request',
    EXPORT_DOWNLOAD: 'export_download',
    USER_REGISTER: 'user_register',
    USER_LOGIN: 'user_login',
  },
  RATE_LIMIT: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 5, // 5 requests per hour
  },
};