import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import InvoicePreview from '../../components/Invoice/InvoicePreview';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    payment_status: '',
    search: '',
    from_date: '',
    to_date: ''
  });
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    test_id: '',
    total_amount: '',
    paid_amount: '',
    payment_method: 'cash',
    payment_status: 'unpaid',
    referred_by: ''
  });

  const [activeMenu, setActiveMenu] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
    fetchStats();
    fetchPatients();
    fetchTests();
  }, [filters]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest('.action-menu')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/billing/invoices', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setInvoices(response.data.data || response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/billing/invoices/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({});
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/patients/all-patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tests/all-tests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(response.data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleViewInvoice = async (invoice) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/billing/invoices/${invoice.invoice_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedInvoice(response.data.data || response.data);
      setIsPreviewOpen(true);
      setActiveMenu(null);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      alert('Failed to load invoice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/billing/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvoices();
      fetchStats();
      setActiveMenu(null);
      alert('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  const handleEdit = (invoice) => {
    setFormData({
      invoice_id: invoice.invoice_id,
      patient_id: invoice.patient_id,
      test_id: invoice.items?.[0]?.test_id || '', // Assuming single test for now or need to handle multiple
      total_amount: invoice.total_amount,
      paid_amount: invoice.paid_amount,
      payment_method: 'cash', // Default or fetch if available
      payment_status: invoice.payment_status
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const openNewInvoiceModal = () => {
    setFormData({
      patient_id: '',
      test_id: '',
      total_amount: '',
      paid_amount: '',
      payment_method: 'cash',
      payment_status: 'unpaid'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const patient = patients.find(p => p.id === parseInt(formData.patient_id));
      const test = tests.find(t => t.test_id === parseInt(formData.test_id));

      const invoiceData = {
        ...formData,
        patient_name: patient?.patient_name || 'Unknown',
        test_name: test?.test_name || 'Unknown',
        balance_amount: parseFloat(formData.total_amount) - parseFloat(formData.paid_amount || 0),
        invoice_date: new Date().toISOString().split('T')[0],
        items: [{
          item_type: 'test',
          item_name: test?.test_name || 'Unknown Test',
          test_id: test?.test_id,
          quantity: 1,
          unit_price: parseFloat(formData.total_amount),
          total_amount: parseFloat(formData.total_amount),
          description: test?.test_code || ''
        }]
      };

      if (formData.invoice_id) {
        await axios.put(`http://localhost:5000/api/billing/invoices/${formData.invoice_id}`, invoiceData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Invoice updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/billing/invoices', invoiceData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Invoice created successfully!');
      }

      setIsModalOpen(false);
      fetchInvoices();
      fetchStats();
    } catch (error) {
      console.error('Error saving invoice:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to save invoice');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate payment status
      if (name === 'total_amount' || name === 'paid_amount') {
        const total = parseFloat(updated.total_amount || 0);
        const paid = parseFloat(updated.paid_amount || 0);

        if (paid === 0) {
          updated.payment_status = 'unpaid';
        } else if (paid >= total) {
          updated.payment_status = 'paid';
        } else {
          updated.payment_status = 'partial';
        }
      }

      return updated;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'unpaid':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: 'badge badge-success',
      partial: 'badge badge-warning',
      unpaid: 'badge badge-danger',
      overdue: 'badge badge-danger'
    };
    return badges[status] || 'badge';
  };

  return (
    <MainLayout title="Billing" subtitle="Manage invoices and payments">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Invoices</p>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-purple-600 font-bold">{stats.total_invoices || 0}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{(stats.total_amount || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total amount</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Paid</p>
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">₹{(stats.total_paid || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.paid_count || 0} invoices</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending</p>
              <ClockIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">₹{(stats.total_balance || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.unpaid_count || 0} invoices</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Partial</p>
              <ClockIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.partial_count || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Partially paid</p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Invoices</h2>
            <p className="text-sm text-gray-500 mt-1">{invoices.length} total invoices</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <FunnelIcon className="w-4 h-4" />
              Filter
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={openNewInvoiceModal}
            >
              <PlusIcon className="w-4 h-4" />
              New Invoice
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="input-field w-full pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="input-field"
            value={filters.payment_status}
            onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
          <input
            type="date"
            className="input-field"
            value={filters.from_date}
            onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
            placeholder="From date"
          />
          <input
            type="date"
            className="input-field"
            value={filters.to_date}
            onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
            placeholder="To date"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Referred By</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-500">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.invoice_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-purple-600">{invoice.invoice_number}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(invoice.invoice_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium">
                          {(invoice.patient_name || 'P')[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{invoice.patient_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900 font-medium">
                        {invoice.referred_by || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      ₹{(invoice.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-green-600 font-medium">
                      ₹{(invoice.paid_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-red-600 font-medium">
                      ₹{(invoice.balance_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={getStatusBadge(invoice.payment_status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(invoice.payment_status)}
                          {invoice.payment_status}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-4 relative action-menu">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === invoice.invoice_id ? null : invoice.invoice_id);
                        }}
                      >
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                      </button>

                      {activeMenu === invoice.invoice_id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                          <div className="py-1">
                            <button
                              onClick={() => handleViewInvoice(invoice)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <PrinterIcon className="w-4 h-4" />
                              View Invoice
                            </button>
                            <button
                              onClick={() => handleEdit(invoice)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(invoice.invoice_id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {invoices.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing 1 to {invoices.length} of {invoices.length} results
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.invoice_id ? "Edit Invoice" : "Create New Invoice"}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient *
              </label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Choose a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.patient_name} - {patient.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Test *
              </label>
              <select
                name="test_id"
                value={formData.test_id}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Choose a test</option>
                {tests.map(test => (
                  <option key={test.test_id} value={test.test_id}>
                    {test.test_name} - ₹{test.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (₹) *
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid Amount (₹)
                </label>
                <input
                  type="number"
                  name="paid_amount"
                  value={formData.paid_amount}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  disabled
                >
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            {formData.total_amount && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">₹{parseFloat(formData.total_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-medium text-green-600">₹{parseFloat(formData.paid_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600 font-medium">Balance:</span>
                  <span className="font-bold text-red-600">
                    ₹{(parseFloat(formData.total_amount || 0) - parseFloat(formData.paid_amount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Hidden Print Modal */}
      {/* Invoice Preview Modal */}
      <InvoicePreview
        invoice={selectedInvoice}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </MainLayout>
  );
};

export default InvoiceList;
