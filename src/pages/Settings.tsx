import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

// Dropdown Options Configuration
const TIMEZONE_OPTIONS = [
  { value: 'Asia/Bahrain', label: 'Bahrain Time (AST/BHT)' },
  { value: 'Asia/Dubai', label: 'Gulf Time (GST/UAE)' },
  { value: 'Asia/Riyadh', label: 'Arabia Time (AST/KSA)' },
  { value: 'Asia/Kuwait', label: 'Kuwait Time (AST/KWT)' },
  { value: 'Asia/Qatar', label: 'Qatar Time (AST/QAT)' },
  { value: 'Asia/Muscat', label: 'Oman Time (GST/OMN)' }
];

const DATE_FORMAT_OPTIONS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' }
];

const CURRENCY_OPTIONS = [
  { value: 'BHD', label: 'Bahraini Dinar (BHD)', default: true },
  { value: 'SAR', label: 'Saudi Riyal (SAR)' },
  { value: 'AED', label: 'UAE Dirham (AED)' },
  { value: 'KWD', label: 'Kuwaiti Dinar (KWD)' },
  { value: 'QAR', label: 'Qatari Riyal (QAR)' },
  { value: 'OMR', label: 'Omani Rial (OMR)' }
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', default: true },
  { value: 'ar', label: 'العربية (Arabic)' }
];

const MEASUREMENT_UNITS = [
  { value: 'metric', label: 'Metric (cm/m)', default: true },
  { value: 'imperial', label: 'Imperial (in/ft)' }
];

const TAX_RATES = [
  { value: '0.10', label: '10% (Default)', default: true },
  { value: '0.05', label: '5%' },
  { value: '0.15', label: '15%' }
];

const SESSION_TIMEOUT_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes', default: true },
  { value: '60', label: '1 hour' },
  { value: '120', label: '2 hours' }
];

const LOGIN_ATTEMPT_OPTIONS = [
  { value: '3', label: '3 attempts' },
  { value: '5', label: '5 attempts', default: true },
  { value: '10', label: '10 attempts' }
];

const QUOTE_VALIDITY_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days', default: true },
  { value: '60', label: '60 days' }
];

const BULK_DISCOUNT_TIERS = [
  { value: 'none', label: 'No bulk discounts' },
  { value: 'basic', label: 'Basic (5% > 5 items, 10% > 10 items)', default: true },
  { value: 'advanced', label: 'Advanced (Custom tiers)' }
];

export default function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    timezone: TIMEZONE_OPTIONS.find(opt => opt.value === 'Asia/Bahrain')?.value,
    dateFormat: DATE_FORMAT_OPTIONS.find(opt => opt.default)?.value || 'DD/MM/YYYY',
    currency: CURRENCY_OPTIONS.find(opt => opt.default)?.value || 'BHD',
    language: LANGUAGE_OPTIONS.find(opt => opt.default)?.value || 'en',
    measurementUnit: MEASUREMENT_UNITS.find(opt => opt.default)?.value || 'metric',
    taxRate: TAX_RATES.find(opt => opt.default)?.value || '0.10',
    quoteValidity: QUOTE_VALIDITY_OPTIONS.find(opt => opt.default)?.value || '30',
    bulkDiscounts: BULK_DISCOUNT_TIERS.find(opt => opt.default)?.value || 'basic'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    weeklyReport: true,
    newQuotes: true,
    quoteUpdates: true,
    systemUpdates: true
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: SESSION_TIMEOUT_OPTIONS.find(opt => opt.default)?.value || '30',
    loginAttempts: LOGIN_ATTEMPT_OPTIONS.find(opt => opt.default)?.value || '5'
  });

  const handleGeneralSettingChange = (key: keyof typeof generalSettings, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecurityChange = (key: keyof typeof security, value: string | boolean) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your system preferences and defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      value={generalSettings.timezone}
                      onChange={(e) => handleGeneralSettingChange('timezone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {TIMEZONE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      value={generalSettings.dateFormat}
                      onChange={(e) => handleGeneralSettingChange('dateFormat', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {DATE_FORMAT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={generalSettings.currency}
                      onChange={(e) => handleGeneralSettingChange('currency', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {CURRENCY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      id="language"
                      value={generalSettings.language}
                      onChange={(e) => handleGeneralSettingChange('language', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {LANGUAGE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="measurementUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Measurement Units
                    </label>
                    <select
                      id="measurementUnit"
                      value={generalSettings.measurementUnit}
                      onChange={(e) => handleGeneralSettingChange('measurementUnit', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {MEASUREMENT_UNITS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Tax Rate
                    </label>
                    <select
                      id="taxRate"
                      value={generalSettings.taxRate}
                      onChange={(e) => handleGeneralSettingChange('taxRate', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {TAX_RATES.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quoteValidity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Quote Validity
                    </label>
                    <select
                      id="quoteValidity"
                      value={generalSettings.quoteValidity}
                      onChange={(e) => handleGeneralSettingChange('quoteValidity', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {QUOTE_VALIDITY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bulkDiscounts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bulk Discount Structure
                    </label>
                    <select
                      id="bulkDiscounts"
                      value={generalSettings.bulkDiscounts}
                      onChange={(e) => handleGeneralSettingChange('bulkDiscounts', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {BULK_DISCOUNT_TIERS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={security.twoFactor}
                        onChange={() => handleSecurityChange('twoFactor', !security.twoFactor)}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout
                    </label>
                    <select
                      id="sessionTimeout"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {SESSION_TIMEOUT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Login Attempts
                    </label>
                    <select
                      id="loginAttempts"
                      value={security.loginAttempts}
                      onChange={(e) => handleSecurityChange('loginAttempts', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {LOGIN_ATTEMPT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    Update Security
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notification Channels</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                      <label htmlFor="email-notifications" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </label>
                    </div>
                    {notifications.email && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="push-notifications"
                        type="checkbox"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                      <label htmlFor="push-notifications" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Push Notifications
                      </label>
                    </div>
                    {notifications.push && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="sms-notifications"
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                      <label htmlFor="sms-notifications" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        SMS Notifications
                      </label>
                    </div>
                    {notifications.sms && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notification Types</h4>
                  
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="weekly-report"
                          type="checkbox"
                          checked={notifications.weeklyReport}
                          onChange={() => handleNotificationChange('weeklyReport')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        />
                        <label htmlFor="weekly-report" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Weekly Reports
                        </label>
                      </div>
                      {notifications.weeklyReport && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="new-quotes"
                          type="checkbox"
                          checked={notifications.newQuotes}
                          onChange={() => handleNotificationChange('newQuotes')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        />
                        <label htmlFor="new-quotes" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          New Quotations
                        </label>
                      </div>
                      {notifications.newQuotes && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="quote-updates"
                          type="checkbox"
                          checked={notifications.quoteUpdates}
                          onChange={() => handleNotificationChange('quoteUpdates')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        />
                        <label htmlFor="quote-updates" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quote Status Updates
                        </label>
                      </div>
                      {notifications.quoteUpdates && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="system-updates"
                          type="checkbox"
                          checked={notifications.systemUpdates}
                          onChange={() => handleNotificationChange('systemUpdates')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        />
                        <label htmlFor="system-updates" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          System Updates
                        </label>
                      </div>
                      {notifications.systemUpdates && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Account Type</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">Administrator</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Account Created</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">Jan 15, 2023</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Last Login</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">Today at 9:42 AM</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">IP Address</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">192.168.1.1</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">License</dt>
                  <dd className="font-medium text-blue-600 dark:text-blue-400">Premium</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}