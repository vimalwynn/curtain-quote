import { createClient } from '@supabase/supabase-js';
import Store from 'electron-store';

const localStore = new Store();

class DataManager {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
    this.syncQueue = [];
    this.isSyncing = false;
  }

  // Handle offline data storage
  async saveLocally(table, data) {
    const offlineData = localStore.get(`offline_${table}`) || [];
    offlineData.push({
      data,
      timestamp: Date.now(),
      synced: false
    });
    localStore.set(`offline_${table}`, offlineData);
  }

  // Sync offline data when online
  async syncOfflineData() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const tables = ['products', 'quotations', 'customers'];
      
      for (const table of tables) {
        const offlineData = localStore.get(`offline_${table}`) || [];
        const unsynced = offlineData.filter(item => !item.synced);

        for (const item of unsynced) {
          try {
            await this.supabase.from(table).upsert(item.data);
            item.synced = true;
          } catch (error) {
            console.error(`Failed to sync ${table} item:`, error);
          }
        }

        localStore.set(`offline_${table}`, offlineData);
      }
    } finally {
      this.isSyncing = false;
    }
  }

  // Get data with offline support
  async getData(table, query = {}) {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select()
        .match(query);

      if (error) throw error;
      
      // Cache data locally
      localStore.set(`cache_${table}`, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      // Return cached data if offline
      const cached = localStore.get(`cache_${table}`);
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  // Save data with offline support
  async saveData(table, data) {
    try {
      const { data: savedData, error } = await this.supabase
        .from(table)
        .upsert(data)
        .select()
        .single();

      if (error) throw error;
      return savedData;
    } catch (error) {
      // Store offline if request fails
      await this.saveLocally(table, data);
      throw new Error('Saved offline. Will sync when online.');
    }
  }
}

export default new DataManager();