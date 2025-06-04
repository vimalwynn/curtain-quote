const Store = require('electron-store');

const store = new Store({
  name: 'app-data', // Name of the storage file
  defaults: {
    settings: {
      theme: 'light',
      currency: 'BHD',
      language: 'en',
      taxRate: 0.10
    },
    recentQuotations: [],
    customerDatabase: [],
    productCatalog: []
  },
  // Encrypt sensitive data
  encryptionKey: 'your-encryption-key',
  clearInvalidConfig: true
});

module.exports = store;

export default store