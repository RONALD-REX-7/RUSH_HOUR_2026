const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const notifications = await Notification.find({ recipient: req.user._id })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: notifications, message: 'Notifications retrieved' });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
  res.status(200).json({ success: true, data: notification, message: 'Marked as read' });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ success: true, message: 'All marked as read' });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
  res.status(200).json({ success: true, data: { count }, message: 'Unread count retrieved' });
});

module.exports = { getNotifications, markAsRead, markAllAsRead, getUnreadCount };
