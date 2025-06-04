import { Notification } from 'electron';
import Store from 'electron-store';

const store = new Store();

class NotificationManager {
  constructor() {
    this.notifications = [];
    this.store = store;
  }

  async send(notification) {
    const { title, body, icon, data } = notification;

    // Create system notification
    const systemNotification = new Notification({
      title,
      body,
      icon: icon || './assets/icon.png',
      silent: false
    });

    // Store notification for history
    const notificationData = {
      id: Date.now().toString(),
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false,
      data
    };

    // Save to store
    const notifications = this.store.get('notifications') || [];
    notifications.unshift(notificationData);
    this.store.set('notifications', notifications.slice(0, 100)); // Keep last 100 notifications

    // Show notification
    systemNotification.show();

    return notificationData;
  }

  async markAsRead(notificationId) {
    const notifications = this.store.get('notifications') || [];
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    this.store.set('notifications', updatedNotifications);
  }

  async getAll() {
    return this.store.get('notifications') || [];
  }

  async getUnread() {
    const notifications = this.store.get('notifications') || [];
    return notifications.filter(notification => !notification.read);
  }

  async clear() {
    this.store.set('notifications', []);
  }
}

export default new NotificationManager();