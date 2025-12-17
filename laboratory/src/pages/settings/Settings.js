import React, { useState, useRef } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import InvoiceTemplateEditor from '../../components/Settings/InvoiceTemplateEditor';
import axios from 'axios';
import {
  BuildingOfficeIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  PhotoIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const LabInfoSettings = () => {
  const [labInfo, setLabInfo] = useState({
    lab_name: 'LabHub Medical Laboratory',
    address: '123 Medical Street, Healthcare City',
    phone: '+91-1234567890',
    email: 'info@labhub.com',
    website: 'www.labhub.com',
    license_number: 'LAB-2024-001',
    logo_url: null
  });
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Load lab info on component mount
  React.useEffect(() => {
    fetchLabInfo();
  }, []);

  const fetchLabInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/settings/lab-info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Lab info fetched:', response.data);
      setLabInfo(response.data);
    } catch (error) {
      console.error('Error fetching lab info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLabInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/settings/upload-logo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setLabInfo(prev => ({
        ...prev,
        logo_url: response.data.logo_url
      }));

      setLogoFile(null);
      setLogoPreview(null);
      
      // Refresh lab info to show the uploaded logo
      await fetchLabInfo();
      
      alert('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!window.confirm('Are you sure you want to remove the logo?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/settings/remove-logo', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLabInfo(prev => ({
        ...prev,
        logo_url: null
      }));

      alert('Logo removed successfully!');
    } catch (error) {
      console.error('Error removing logo:', error);
      alert('Failed to remove logo');
    }
  };

  const handleSaveLabInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/settings/lab-info', labInfo, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Laboratory information updated successfully!');
    } catch (error) {
      console.error('Error saving lab info:', error);
      alert('Failed to save laboratory information');
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Laboratory Information</h2>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading laboratory information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Laboratory Information</h2>
      
      <div className="space-y-6">
        {/* Logo Upload Section */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Laboratory Logo</h3>
          
          <div className="flex items-start gap-6">
            {/* Current Logo Display */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {labInfo.logo_url ? (
                  <img
                    src={`http://localhost:5000${labInfo.logo_url}`}
                    alt="Laboratory Logo"
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      console.error('Error loading logo:', e);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No logo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Logo Upload Controls */}
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Laboratory Logo
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload your laboratory logo to appear on invoices and reports. 
                    Recommended size: 200x200px, Max size: 5MB
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    className="hidden"
                  />
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <CloudArrowUpIcon className="w-4 h-4" />
                      Select Logo
                    </button>
                    
                    {logoFile && (
                      <button
                        onClick={handleLogoUpload}
                        disabled={uploading}
                        className="btn-primary flex items-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <CloudArrowUpIcon className="w-4 h-4" />
                            Upload Logo
                          </>
                        )}
                      </button>
                    )}
                    
                    {labInfo.logo_url && (
                      <button
                        onClick={handleRemoveLogo}
                        className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>

                {logoFile && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Selected file:</strong> {logoFile.name} ({(logoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Laboratory Information Form */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Laboratory Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Laboratory Name *
              </label>
              <input
                type="text"
                name="lab_name"
                value={labInfo.lab_name}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Enter laboratory name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                name="license_number"
                value={labInfo.license_number}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Enter license number"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={labInfo.address}
                onChange={handleInputChange}
                className="input-field w-full"
                rows="3"
                placeholder="Enter laboratory address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={labInfo.phone}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={labInfo.email}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Enter email address"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={labInfo.website}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Enter website URL"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveLabInfo}
              className="btn-primary"
            >
              Save Laboratory Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
            <LabInfoSettings />
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
