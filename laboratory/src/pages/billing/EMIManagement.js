import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const EMIManagement = () => {
  const [emiPlans, setEmiPlans] = useState([]);
  const [dueInstallments, setDueInstallments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoice_id: '',
    total_installments: '3',
    down_payment: '0',
    interest_rate: '0',
    start_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch EMI plans
      const plansResponse = await axios.get('http://localhost:5000/api/emi/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmiPlans(plansResponse.data.data || plansResponse.data || []);

      // Fetch due installments
      const dueResponse = await axios.get('http://localhost:5000/api/emi/installments/due', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDueInstallments(dueResponse.data.data || dueResponse.data || []);

      // Fetch stats
      const statsResponse = await axios.get('http://localhost:5000/api/emi/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data.data || {});

      // Fetch invoices for dropdown
      const invoicesResponse = await axios.get('http://localhost:5000/api/billing/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(invoicesResponse.data.data || invoicesResponse.data || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching EMI data:', error);
      setEmiPlans([]);
      setDueInstallments([]);
      setStats({});
      setInvoices([]);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const invoice = invoices.find(inv => inv.invoice_id === parseInt(formData.invoice_id));
      if (!invoice) {
        alert('Please select an invoice');
        return;
      }

      const totalAmount = parseFloat(invoice.balance_amount || invoice.total_amount);
      const downPayment = parseFloat(formData.down_payment || 0);
      const remainingAmount = totalAmount - downPayment;
      const installments = parseInt(formData.total_installments);
      const emiAmount = Math.ceil(remainingAmount / installments);

      const emiData = {
        ...formData,
        invoice_number: invoice.invoice_number,
        patient_name: invoice.patient_name,
        total_amount: totalAmount,
        down_payment: downPayment,
        emi_amount: emiAmount,
        remaining_amount: remainingAmount,
        paid_installments: 0,
        status: 'active'
      };
      
      await axios.post('http://localhost:5000/api/emi/plans', emiData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsModalOpen(false);
      setFormData({
        invoice_id: '',
        total_installments: '3',
        down_payment: '0',
        interest_rate: '0',
        start_date: new Date().toISOString().split('T')[0]
      });
      fetchData();
      alert('EMI Plan created successfully!');
    } catch (error) {
      console.error('Error creating EMI plan:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to create EMI plan');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateEMI = () => {
    const invoice = invoices.find(inv => inv.invoice_id === parseInt(formData.invoice_id));
    if (!invoice) return { total: 0, down: 0, remaining: 0, emi: 0 };

    const total = parseFloat(invoice.balance_amount || invoice.total_amount || 0);
    const down = parseFloat(formData.down_payment || 0);
    const remaining = total - down;
    const installments = parseInt(formData.total_installments || 1);
    const emi = Math.ceil(remaining / installments);

    return { total, down, remaining, emi, installments };
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge badge-info',
      completed: 'badge badge-success',
      defaulted: 'badge badge-danger',
      cancelled: 'badge'
    };
    return badges[status] || 'badge';
  };

  return (
    <MainLayout title="EMI Management" subtitle="Manage installment plans and payments">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Plans</p>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold">{stats.total_plans || 0}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_installments || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total installments</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Paid</p>
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">₹{(stats.total_paid || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.paid_installments || 0} installments</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending</p>
              <ClockIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending_installments || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Pending payments</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Overdue</p>
              <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.overdue_installments || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Overdue payments</p>
          </div>
        </div>
      )}

      {/* Due Installments Card */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Due Installments (Next 7 Days)</h2>
            <p className="text-sm text-gray-500 mt-1">{dueInstallments.length} installments due</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Send Reminders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Installment</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dueInstallments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No due installments in the next 7 days
                  </td>
                </tr>
              ) : (
                dueInstallments.map((installment) => (
                  <tr key={installment.installment_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium">
                          {(installment.patient_name || 'P')[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{installment.patient_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-purple-600 font-medium">{installment.invoice_number}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      #{installment.installment_number}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(installment.due_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      ₹{(installment.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                          Pay
                        </button>
                        <button className="px-3 py-1.5 bg-blue-100 text-blue-600 text-sm rounded-lg hover:bg-blue-200 transition-colors">
                          Remind
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All EMI Plans Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">All EMI Plans</h2>
            <p className="text-sm text-gray-500 mt-1">{emiPlans.length} active plans</p>
          </div>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            New EMI Plan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">EMI Amount</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    Loading EMI plans...
                  </td>
                </tr>
              ) : emiPlans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No EMI plans found
                  </td>
                </tr>
              ) : (
                emiPlans.map((plan) => (
                  <tr key={plan.emi_plan_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium">
                          {(plan.patient_name || 'P')[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{plan.patient_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-purple-600 font-medium">{plan.invoice_number}</span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      ₹{(plan.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-blue-600">
                      ₹{(plan.emi_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ 
                              width: `${((plan.paid_installments || 0) / (plan.total_installments || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {plan.paid_installments || 0}/{plan.total_installments || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={getStatusBadge(plan.status)}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create EMI Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create EMI Plan"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Invoice *
              </label>
              <select
                name="invoice_id"
                value={formData.invoice_id}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Choose an invoice</option>
                {invoices.filter(inv => inv.payment_status !== 'paid').map(invoice => (
                  <option key={invoice.invoice_id} value={invoice.invoice_id}>
                    {invoice.invoice_number} - {invoice.patient_name} - ₹{(invoice.balance_amount || invoice.total_amount || 0).toLocaleString()}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Only unpaid/partial invoices are shown</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Installments *
                </label>
                <select
                  name="total_installments"
                  value={formData.total_installments}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="9">9 Months</option>
                  <option value="12">12 Months</option>
                  <option value="18">18 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment (₹)
                </label>
                <input
                  type="number"
                  name="down_payment"
                  value={formData.down_payment}
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
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  name="interest_rate"
                  value={formData.interest_rate}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
            </div>

            {formData.invoice_id && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">EMI Calculation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">₹{calculateEMI().total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Down Payment:</span>
                    <span className="font-medium text-green-600">-₹{calculateEMI().down.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-purple-200">
                    <span className="text-gray-600 font-medium">Remaining Amount:</span>
                    <span className="font-bold text-purple-600">₹{calculateEMI().remaining.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Number of Installments:</span>
                    <span className="font-medium">{calculateEMI().installments} months</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-purple-200">
                    <span className="text-gray-600 font-medium">EMI per Month:</span>
                    <span className="font-bold text-blue-600 text-lg">₹{calculateEMI().emi.toLocaleString()}</span>
                  </div>
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
                disabled={!formData.invoice_id}
              >
                Create EMI Plan
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default EMIManagement;
