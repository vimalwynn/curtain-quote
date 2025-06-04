import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import store from './store';
import notificationManager from './notificationManager';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }

  return mainWindow;
}

app.whenReady().then(() => {
  const mainWindow = createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Store operations
ipcMain.handle('electron-store-get', async (_, key) => {
  return store.get(key);
});

ipcMain.handle('electron-store-set', async (_, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('electron-store-delete', async (_, key) => {
  store.delete(key);
  return true;
});

// Notification operations
ipcMain.handle('send-notification', async (_, notification) => {
  return notificationManager.send(notification);
});

ipcMain.handle('get-notifications', async () => {
  return notificationManager.getAll();
});

ipcMain.handle('mark-notification-read', async (_, notificationId) => {
  return notificationManager.markAsRead(notificationId);
});

ipcMain.handle('get-unread-notifications', async () => {
  return notificationManager.getUnread();
});

// Data operations
ipcMain.handle('save-quotation', async (_, quotation) => {
  const quotations = store.get('recentQuotations') || [];
  quotations.unshift({
    ...quotation,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  store.set('recentQuotations', quotations.slice(0, 100));
  
  // Send notification to other users
  notificationManager.send({
    title: 'New Quotation Created',
    body: `Quotation ${quotation.number} has been created`,
    data: { type: 'quotation', id: quotation.id }
  });
  
  return true;
});

ipcMain.handle('get-quotations', async () => {
  return store.get('recentQuotations') || [];
});

ipcMain.handle('save-customer', async (_, customer) => {
  const customers = store.get('customerDatabase') || [];
  const existingIndex = customers.findIndex(c => c.id === customer.id);
  
  if (existingIndex >= 0) {
    customers[existingIndex] = {
      ...customer,
      updatedAt: new Date().toISOString()
    };
  } else {
    customers.push({
      ...customer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  store.set('customerDatabase', customers);
  return true;
});

ipcMain.handle('get-customers', async () => {
  return store.get('customerDatabase') || [];
});

ipcMain.handle('save-settings', async (_, settings) => {
  store.set('settings', { ...store.get('settings'), ...settings });
  return true;
});

ipcMain.handle('get-settings', async () => {
  return store.get('settings');
});

ipcMain.handle('backup-data', async () => {
  const data = {
    settings: store.get('settings'),
    quotations: store.get('recentQuotations'),
    customers: store.get('customerDatabase'),
    products: store.get('productCatalog'),
    fabrics: store.get('fabricLibrary'),
    templates: store.get('templates'),
    exportedAt: new Date().toISOString()
  };
  return data;
});

ipcMain.handle('restore-data', async (_, data) => {
  try {
    store.set('settings', data.settings);
    store.set('recentQuotations', data.quotations);
    store.set('customerDatabase', data.customers);
    store.set('productCatalog', data.products);
    store.set('fabricLibrary', data.fabrics);
    store.set('templates', data.templates);
    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
});