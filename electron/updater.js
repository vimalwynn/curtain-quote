import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Configure update checking interval (2 hours)
const CHECK_INTERVAL = 2 * 60 * 60 * 1000;

class UpdateManager {
  constructor() {
    this.initialize();
  }

  initialize() {
    // Handle update events
    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', info);
    });

    autoUpdater.on('update-not-available', () => {
      log.info('No updates available');
    });

    autoUpdater.on('download-progress', (progress) => {
      log.info(`Download progress: ${Math.round(progress.percent)}%`);
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded:', info);
    });

    autoUpdater.on('error', (err) => {
      log.error('Update error:', err);
    });

    // Start periodic update checks
    this.startPeriodicChecks();
  }

  startPeriodicChecks() {
    // Check immediately on startup
    this.checkForUpdates();
    
    // Then check periodically
    setInterval(() => {
      this.checkForUpdates();
    }, CHECK_INTERVAL);
  }

  async checkForUpdates() {
    try {
      await autoUpdater.checkForUpdates();
    } catch (error) {
      log.error('Failed to check for updates:', error);
    }
  }

  async downloadUpdate() {
    try {
      await autoUpdater.downloadUpdate();
    } catch (error) {
      log.error('Failed to download update:', error);
      throw error;
    }
  }

  installUpdate() {
    autoUpdater.quitAndInstall(false, true);
  }
}

export default new UpdateManager();