const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('electron-store-get', key),
    set: (key, value) => ipcRenderer.invoke('electron-store-set', key, value),
    delete: (key) => ipcRenderer.invoke('electron-store-delete', key),
  }
});