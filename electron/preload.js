const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('electron-store-get', key),
    set: (key, value) => ipcRenderer.invoke('electron-store-set', key, value),
    delete: (key) => ipcRenderer.invoke('electron-store-delete', key),
  },
  notifications: {
    send: (notification) => ipcRenderer.invoke('send-notification', notification),
    getAll: () => ipcRenderer.invoke('get-notifications'),
    getUnread: () => ipcRenderer.invoke('get-unread-notifications'),
    markAsRead: (id) => ipcRenderer.invoke('mark-notification-read', id),
  },
  quotations: {
    save: (quotation) => ipcRenderer.invoke('save-quotation', quotation),
    getAll: () => ipcRenderer.invoke('get-quotations'),
  },
  customers: {
    save: (customer) => ipcRenderer.invoke('save-customer', customer),
    getAll: () => ipcRenderer.invoke('get-customers'),
  },
  settings: {
    save: (settings) => ipcRenderer.invoke('save-settings', settings),
    get: () => ipcRenderer.invoke('get-settings'),
  },
  data: {
    backup: () => ipcRenderer.invoke('backup-data'),
    restore: (data) => ipcRenderer.invoke('restore-data', data)
  }
});