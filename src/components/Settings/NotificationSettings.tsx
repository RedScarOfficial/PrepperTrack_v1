import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertTriangle, Calendar, Package, Users } from 'lucide-react';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    enableNotifications: true,
    emailNotifications: true,
    pushNotifications: false,
    soundAlerts: true,
    
    // Expiration alerts
    expirationAlerts: true,
    expirationDays: [7, 30, 90],
    
    // Inventory alerts
    lowStockAlerts: true,
    lowStockThreshold: 20,
    
    // Household alerts
    householdChanges: true,
    
    // System alerts
    systemUpdates: true,
    securityAlerts: true,
    
    // Quiet hours
    enableQuietHours: true,
    quietStart: '22:00',
    quietEnd: '07:00',
  });

  const handleNotificationChange = (key: string, value: any) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleExpirationDaysChange = (days: number, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      expirationDays: checked 
        ? [...prev.expirationDays, days].sort((a, b) => a - b)
        : prev.expirationDays.filter(d => d !== days)
    }));
  };

  return (
    <div className="space-y-8">
      {/* General Notification Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">General Notifications</h3>
            <p className="text-sm text-slate-600">Configure how you receive alerts and notifications</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-800">Enable Notifications</h4>
              <p className="text-sm text-slate-600">Master switch for all notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.enableNotifications}
                onChange={(e) => handleNotificationChange('enableNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {notifications.enableNotifications && (
            <>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <div>
                    <h4 className="font-medium text-slate-800">Email Notifications</h4>
                    <p className="text-sm text-slate-600">Receive alerts via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-slate-500" />
                  <div>
                    <h4 className="font-medium text-slate-800">Push Notifications</h4>
                    <p className="text-sm text-slate-600">Browser push notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-800">Sound Alerts</h4>
                  <p className="text-sm text-slate-600">Play sound for important notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.soundAlerts}
                    onChange={(e) => handleNotificationChange('soundAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Expiration Alerts */}
      {notifications.enableNotifications && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-6 w-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Expiration Alerts</h3>
              <p className="text-sm text-slate-600">Get notified when items are approaching expiration</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-800">Enable Expiration Alerts</h4>
                <p className="text-sm text-slate-600">Notify when items are expiring soon</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.expirationAlerts}
                  onChange={(e) => handleNotificationChange('expirationAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {notifications.expirationAlerts && (
              <div className="ml-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h5 className="font-medium text-slate-800 mb-3">Alert Timing</h5>
                <div className="space-y-2">
                  {[
                    { days: 7, label: '7 days before expiration' },
                    { days: 30, label: '30 days before expiration' },
                    { days: 90, label: '90 days before expiration' },
                    { days: 180, label: '6 months before expiration' },
                  ].map((option) => (
                    <label key={option.days} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.expirationDays.includes(option.days)}
                        onChange={(e) => handleExpirationDaysChange(option.days, e.target.checked)}
                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-slate-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inventory Alerts */}
      {notifications.enableNotifications && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Inventory Alerts</h3>
              <p className="text-sm text-slate-600">Notifications for inventory changes and low stock</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-800">Low Stock Alerts</h4>
                <p className="text-sm text-slate-600">Notify when inventory levels are low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.lowStockAlerts}
                  onChange={(e) => handleNotificationChange('lowStockAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {notifications.lowStockAlerts && (
              <div className="ml-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Low Stock Threshold</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={notifications.lowStockThreshold}
                    onChange={(e) => handleNotificationChange('lowStockThreshold', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-green-800 min-w-[40px]">
                    {notifications.lowStockThreshold}%
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Alert when stock falls below this percentage of target levels
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Alerts */}
      {notifications.enableNotifications && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-800">System Alerts</h3>
              <p className="text-sm text-slate-600">Important system and security notifications</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-800">Household Changes</h4>
                <p className="text-sm text-slate-600">Notify when household members are added or modified</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.householdChanges}
                  onChange={(e) => handleNotificationChange('householdChanges', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-800">System Updates</h4>
                <p className="text-sm text-slate-600">Notify about application updates and new features</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.systemUpdates}
                  onChange={(e) => handleNotificationChange('systemUpdates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-800">Security Alerts</h4>
                <p className="text-sm text-slate-600">Critical security notifications and warnings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.securityAlerts}
                  onChange={(e) => handleNotificationChange('securityAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Quiet Hours */}
      {notifications.enableNotifications && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Quiet Hours</h3>
              <p className="text-sm text-slate-600">Suppress non-critical notifications during specified hours</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-800">Enable Quiet Hours</h4>
                <p className="text-sm text-slate-600">Reduce notifications during sleep hours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.enableQuietHours}
                  onChange={(e) => handleNotificationChange('enableQuietHours', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {notifications.enableQuietHours && (
              <div className="ml-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={notifications.quietStart}
                      onChange={(e) => handleNotificationChange('quietStart', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={notifications.quietEnd}
                      onChange={(e) => handleNotificationChange('quietEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <p className="text-xs text-purple-700 mt-2">
                  Critical security alerts will still be delivered during quiet hours
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-slate-800 mb-4">Notification Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Notifications:</span>
              <span className={`text-sm font-medium ${notifications.enableNotifications ? 'text-green-600' : 'text-red-600'}`}>
                {notifications.enableNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Email Alerts:</span>
              <span className={`text-sm font-medium ${notifications.emailNotifications && notifications.enableNotifications ? 'text-green-600' : 'text-red-600'}`}>
                {notifications.emailNotifications && notifications.enableNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Expiration Alerts:</span>
              <span className={`text-sm font-medium ${notifications.expirationAlerts && notifications.enableNotifications ? 'text-green-600' : 'text-red-600'}`}>
                {notifications.expirationAlerts && notifications.enableNotifications ? `${notifications.expirationDays.length} timeframes` : 'Disabled'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Low Stock Alerts:</span>
              <span className={`text-sm font-medium ${notifications.lowStockAlerts && notifications.enableNotifications ? 'text-green-600' : 'text-red-600'}`}>
                {notifications.lowStockAlerts && notifications.enableNotifications ? `${notifications.lowStockThreshold}% threshold` : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Quiet Hours:</span>
              <span className={`text-sm font-medium ${notifications.enableQuietHours && notifications.enableNotifications ? 'text-green-600' : 'text-red-600'}`}>
                {notifications.enableQuietHours && notifications.enableNotifications ? `${notifications.quietStart} - ${notifications.quietEnd}` : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Sound Alerts:</span>
              <span className={`text-sm font-medium ${notifications.soundAlerts && notifications.enableNotifications ? 'text-green-600' : 'text-red-600'}`}>
                {notifications.soundAlerts && notifications.enableNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}