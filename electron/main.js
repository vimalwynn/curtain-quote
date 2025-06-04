import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import store from './store';
import notificationManager from './notificationManager';
import updater from './updater';
import dataManager from './dataManager';

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

  // Check for offline data to sync periodically
  setInterval(() => {
    dataManager.syncOfflineData();
  }, 5 * 60 * 1000); // Every 5 minutes

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

// Data operations
ipcMain.handle('get-data', async (_, table, query) => {
  return dataManager.getData(table, query);
});

ipcMain.handle('save-data', async (_, table, data) => {
  return dataManager.saveData(table, data);
});

// Rest of the existing IPC handlers...