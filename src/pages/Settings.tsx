import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    weeklyReport: true,
    newUsers: false,
    productUpdates: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: "30",
    loginAttempts: "5",
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleSecurityChange = (key: keyof typeof security, value: string) => {
    setSecurity({
      ...security,
      [key]: value,
    });
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
                Update your admin dashboard preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue="Acme Inc."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    defaultValue="https://acme.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    defaultValue="America/New_York"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    defaultValue="MM/DD/YYYY"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="mr-3">
                    Cancel
                  </Button>
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
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
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
                      onChange={() => handleSecurityChange('twoFactor', security.twoFactor ? 'false' : 'true')}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Session Timeout (minutes)
                  </label>
                  <select
                    id="sessionTimeout"
                    value={security.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Login Attempts
                  </label>
                  <select
                    id="loginAttempts"
                    value={security.loginAttempts}
                    onChange={(e) => handleSecurityChange('loginAttempts', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="3">3 attempts</option>
                    <option value="5">5 attempts</option>
                    <option value="10">10 attempts</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Change Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Current password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="mt-3 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="mt-3 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="mr-3">
                    Cancel
                  </Button>
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
                          id="new-users"
                          type="checkbox"
                          checked={notifications.newUsers}
                          onChange={() => handleNotificationChange('newUsers')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        />
                        <label htmlFor="new-users" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          New User Registrations
                        </label>
                      </div>
                      {notifications.newUsers && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="product-updates"
                          type="checkbox"
                          checked={notifications.productUpdates}
                          onChange={() => handleNotificationChange('productUpdates')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        />
                        <label htmlFor="product-updates" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Product Updates
                        </label>
                      </div>
                      {notifications.productUpdates && (
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