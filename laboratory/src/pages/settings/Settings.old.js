import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import {
  BuildingOfficeIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Cog6ToothIcon },
    { id: 'lab', label: 'Lab Info', icon: BuildingOfficeIcon },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'templates', label: 'Templates', icon: DocumentTextIcon }
  ];

  return (
    <MainLayout title="Settings" subtitle="Manage your laboratory settings and preferences">
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-3 card">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select className="input-field w-full">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Format
                  </label>
                  <select className="input-field w-full">
                    <option>12 Hour (AM/PM)</option>
                    <option>24 Hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select className="input-field w-full">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select className="input-field w-full">
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </div>

                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'lab' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Laboratory Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Laboratory Name
                  </label>
                  <input type="text" className="input-field w-full" placeholder="Enter lab name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input type="text" className="input-field w-full" placeholder="Enter registration number" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea className="input-field w-full" rows="3" placeholder="Enter complete address"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input type="tel" className="input-field w-full" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input type="email" className="input-field w-full" placeholder="Enter email" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input type="url" className="input-field w-full" placeholder="Enter website URL" />
                </div>

                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">User Profile</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
                    AD
                  </div>
                  <div>
                    <button className="btn-secondary mb-2">Change Photo</button>
                    <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input type="text" className="input-field w-full" placeholder="Enter first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input type="text" className="input-field w-full" placeholder="Enter last name" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input type="email" className="input-field w-full" placeholder="Enter email" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input type="tel" className="input-field w-full" placeholder="Enter phone number" />
                </div>

                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Billing Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Tax Rate (%)
                  </label>
                  <input type="number" className="input-field w-full" placeholder="Enter tax rate" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Prefix
                  </label>
                  <input type="text" className="input-field w-full" placeholder="e.g., INV-" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms (Days)
                  </label>
                  <input type="number" className="input-field w-full" placeholder="Enter payment terms" />
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="auto-invoice" className="w-4 h-4 text-purple-600 rounded" />
                  <label htmlFor="auto-invoice" className="text-sm text-gray-700">
                    Auto-generate invoice numbers
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="email-invoice" className="w-4 h-4 text-purple-600 rounded" />
                  <label htmlFor="email-invoice" className="text-sm text-gray-700">
                    Email invoices automatically
                  </label>
                </div>

                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive email updates</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive SMS alerts</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Low Stock Alerts</p>
                    <p className="text-sm text-gray-500">Get notified when stock is low</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Expiry Alerts</p>
                    <p className="text-sm text-gray-500">Get notified about expiring items</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Payment Reminders</p>
                    <p className="text-sm text-gray-500">Send payment reminders to patients</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" defaultChecked />
                </div>

                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input type="password" className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input type="password" className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input type="password" className="input-field w-full" />
                    </div>
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Report Templates</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Invoice Template</h3>
                    <button className="btn-secondary text-sm">Edit</button>
                  </div>
                  <p className="text-sm text-gray-500">Customize your invoice layout and branding</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Report Template</h3>
                    <button className="btn-secondary text-sm">Edit</button>
                  </div>
                  <p className="text-sm text-gray-500">Customize test report format and header</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Receipt Template</h3>
                    <button className="btn-secondary text-sm">Edit</button>
                  </div>
                  <p className="text-sm text-gray-500">Customize payment receipt layout</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;