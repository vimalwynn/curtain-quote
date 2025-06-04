import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import store from './store';

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

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

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

// Handle store operations
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

// Handle specific data operations
ipcMain.handle('save-quotation', async (_, quotation) => {
  const quotations = store.get('recentQuotations') || [];
  quotations.unshift(quotation);
  store.set('recentQuotations', quotations.slice(0, 100)); // Keep last 100 quotations
  return true;
});

ipcMain.handle('get-quotations', async () => {
  return store.get('recentQuotations') || [];
});

ipcMain.handle('save-customer', async (_, customer) => {
  const customers = store.get('customerDatabase') || [];
  const existingIndex = customers.findIndex(c => c.id === customer.id);
  
  if (existingIndex >= 0) {
    customers[existingIndex] = customer;
  } else {
    customers.push(customer);
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