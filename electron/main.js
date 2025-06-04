import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import store from './store';
import notificationManager from './notificationManager';
import updater from './updater';

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

  // Initialize auto-updater
  if (process.env.NODE_ENV !== 'development') {
    updater.initialize();
  }

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

// Update operations
ipcMain.handle('check-for-updates', async () => {
  return updater.checkForUpdates();
});

ipcMain.handle('download-update', async () => {
  return updater.downloadUpdate();
});

ipcMain.handle('install-update', () => {
  updater.installUpdate();
});

// Rest of the existing IPC handlers...