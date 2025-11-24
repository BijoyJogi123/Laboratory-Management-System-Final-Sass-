import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import InvoiceTemplateEditor from '../../components/Settings/InvoiceTemplateEditor';
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
  const [activeTab, setActiveTab] = useState('templates');

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
          {activeTab === 'templates' && (
            <div>
              <InvoiceTemplateEditor />
            </div>
          )}

          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
              <p className="text-gray-500">General settings coming soon...</p>
            </div>
          )}

          {activeTab === 'lab' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Laboratory Information</h2>
              <p className="text-gray-500">Lab info settings coming soon...</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">User Profile</h2>
              <p className="text-gray-500">Profile settings coming soon...</p>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Billing Settings</h2>
              <p className="text-gray-500">Billing settings coming soon...</p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
              <p className="text-gray-500">Notification settings coming soon...</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              <p className="text-gray-500">Security settings coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
