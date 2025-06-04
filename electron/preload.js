const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('electron-store-get', key),
    set: (key, value) => ipcRenderer.invoke('electron-store-set', key, value),
    delete: (key) => ipcRenderer.invoke('electron-store-delete', key),
  },
  updater: {
    check: () => ipcRenderer.invoke('check-for-updates'),
    download: () => ipcRenderer.invoke('download-update'),
    install: () => ipcRenderer.invoke('install-update'),
  },
  notifications: {
    send: (notification) => ipcRenderer.invoke('send-notification', notification),
    getAll: () => ipcRenderer.invoke('get-notifications'),
    getUnread: () => ipcRenderer.invoke('get-unread-notifications'),
    markAsRead: (id) => ipcRenderer.invoke('mark-notification-read', id),
  },
  // Rest of the existing API...
});