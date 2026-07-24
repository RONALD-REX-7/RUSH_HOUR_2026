module.exports = {
  USER_ROLES: { CITIZEN: 'citizen', ENTREPRENEUR: 'entrepreneur', ADMIN: 'admin' },
  REPORT_STATUS: { PENDING: 'pending', AI_ANALYZED: 'ai_analyzed', VERIFIED: 'verified', REJECTED: 'rejected', CONVERTED: 'converted' },
  OPPORTUNITY_STATUS: { OPEN: 'open', IN_QUEUE: 'in_queue', CLAIMED: 'claimed', IN_PROGRESS: 'in_progress', COMPLETED: 'completed', CLOSED: 'closed' },
  QUEUE_STATUS: { WAITING: 'waiting', OFFERED: 'offered', ACCEPTED: 'accepted', DECLINED: 'declined', EXPIRED: 'expired' },
  DEMAND_LEVELS: { LOW: 'low', MEDIUM: 'medium', HIGH: 'high', CRITICAL: 'critical' },
  CATEGORIES: ['Healthcare', 'Grocery & Retail', 'EV & Transport', 'Repair & Maintenance', 'Education', 'Financial Services', 'Food & Restaurants', 'Utilities', 'Recreation', 'Other'],
  MAX_QUEUE_SIZE: 6,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  NOTIFICATION_TYPES: { REPORT_STATUS: 'report_status', OPPORTUNITY_NEW: 'opportunity_new', QUEUE_UPDATE: 'queue_update', QUEUE_OFFER: 'queue_offer', MILESTONE: 'milestone', SYSTEM: 'system' }
};
