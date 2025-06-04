import Store from 'electron-store';

const store = new Store({
  name: 'app-data',
  defaults: {
    settings: {
      theme: 'light',
      currency: 'BHD',
      language: 'en',
      taxRate: 0.10,
      measurementUnit: 'metric',
      dateFormat: 'DD/MM/YYYY',
      quoteValidity: 30,
      bulkDiscounts: 'basic'
    },
    recentQuotations: [],
    customerDatabase: [],
    productCatalog: [],
    fabricLibrary: [],
    templates: []
  },
  encryptionKey: 'your-encryption-key',
  clearInvalidConfig: true,
  // Configure file location
  cwd: 'storage'
});

export default store;