import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BuildingOfficeIcon, 
  DocumentTextIcon,
  PaintBrushIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const InvoiceTemplateEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    lab_name: '',
    logo_url: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    tax_id: '',
    terms_conditions: '',
    header_color: '#2563eb',
    show_logo: true,
    invoice_prefix: 'INV',
    footer_text: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/settings/invoice', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.data) {
        setFormData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/settings/invoice', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Invoice template settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Invoice Template</h2>
      
      <div className="space-y-6">
        {/* Lab Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Laboratory Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Laboratory Name *
              </label>
              <input
                type="text"
                name="lab_name"
                value={formData.lab_name}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Prefix
              </label>
              <input
                type="text"
                name="invoice_prefix"
                value={formData.invoice_prefix}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="INV"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field w-full"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax/GST ID
              </label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Branding Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PaintBrushIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Branding</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="header_color"
                  value={formData.header_color}
                  onChange={handleInputChange}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.header_color}
                  onChange={(e) => setFormData({ ...formData, header_color: e.target.value })}
                  className="input-field flex-1"
                />
              </div>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="show_logo"
                  checked={formData.show_logo}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Logo on Invoice</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Terms & Conditions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DocumentTextIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Invoice Content</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                name="terms_conditions"
                value={formData.terms_conditions}
                onChange={handleInputChange}
                className="input-field w-full"
                rows="4"
                placeholder="Enter terms and conditions to display on invoices"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Text
              </label>
              <textarea
                name="footer_text"
                value={formData.footer_text}
                onChange={handleInputChange}
                className="input-field w-full"
                rows="2"
                placeholder="Additional footer text (optional)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-6 pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={fetchSettings}
          className="btn-secondary"
          disabled={saving}
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center gap-2"
          disabled={saving}
        >
          {saving ? (
            <>Saving...</>
          ) : (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InvoiceTemplateEditor;
