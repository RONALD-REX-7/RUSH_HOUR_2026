const Notification = require('../models/Notification');

const createNotification = async ({ recipient, type, title, message, data }) => {
  try {
    const notification = await Notification.create({ recipient, type, title, message, data });
    return notification;
  } catch (error) {
    console.error(`Notification Error: ${error.message}`);
  }
};

module.exports = { createNotification };
