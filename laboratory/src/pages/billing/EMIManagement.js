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

  const [activeMenu, setActiveMenu] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    payment_mode: 'cash',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this EMI plan?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/emi/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setActiveMenu(null);
      alert('EMI Plan deleted successfully');
    } catch (error) {
      console.error('Error deleting EMI plan:', error);
      alert('Failed to delete EMI plan');
    }
  };

  const handleStatusChange = async (emiPlanId, invoiceId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      // Update EMI status
      await axios.put(`http://localhost:5000/api/emi/plans/${emiPlanId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If status is completed, update invoice to paid
      if (newStatus === 'completed') {
        await axios.put(`http://localhost:5000/api/billing/invoices/${invoiceId}`, 
          { 
            payment_status: 'paid',
            balance_amount: 0
          }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh data
      fetchData();
      alert(`EMI status updated to ${newStatus}${newStatus === 'completed' ? ' and invoice marked as paid' : ''}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleView = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/emi/plans/${plan.emi_plan_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedPlan(response.data.data);
      setViewModalOpen(true);
      setActiveMenu(null);
    } catch (error) {
      console.error('Error fetching plan details:', error);
      alert('Failed to fetch plan details');
    }
  };

  const handlePayClick = (installment) => {
    setSelectedInstallment(installment);
    setPaymentFormData({
      amount: installment.amount - (installment.paid_amount || 0),
      payment_mode: 'cash',
      notes: ''
    });
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/emi/installments/${selectedInstallment.installment_id}/pay`, paymentFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchData();
      if (selectedPlan) {
        // Refresh selected plan details if modal is open
        const planRes = await axios.get(`http://localhost:5000/api/emi/plans/${selectedPlan.emi_plan_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedPlan(planRes.data.data);
      }

      setPaymentModalOpen(false);
      alert('Payment recorded successfully');
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment');
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
        invoice_id: formData.invoice_id,
        invoice_number: invoice.invoice_number,
        patient_name: invoice.patient_name,
        total_amount: totalAmount,
        down_payment: downPayment,
        emi_amount: emiAmount,
        remaining_amount: remainingAmount,
        number_of_installments: installments,
        interest_rate: parseFloat(formData.interest_rate || 0),
        start_date: formData.start_date,
        frequency: 'monthly',
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
                        <button
                          onClick={() => handlePayClick(installment)}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
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
                      <select
                        value={plan.status}
                        onChange={(e) => handleStatusChange(plan.emi_plan_id, plan.invoice_id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                          plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                          plan.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          plan.status === 'defaulted' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="active">active</option>
                        <option value="completed">completed</option>
                        <option value="defaulted">defaulted</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 relative action-menu">
                      <button
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === plan.emi_plan_id ? null : plan.emi_plan_id);
                        }}
                      >
                        Actions
                      </button>

                      {activeMenu === plan.emi_plan_id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                          <div className="py-1">
                            <button
                              onClick={() => handleView(plan)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleDelete(plan.emi_plan_id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete Plan
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

      {/* View Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="EMI Plan Details"
        size="lg"
      >
        {selectedPlan && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patient Name</p>
                <p className="font-medium text-gray-900">{selectedPlan.patient_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Invoice Number</p>
                <p className="font-medium text-gray-900">{selectedPlan.invoice_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-gray-900">₹{selectedPlan.total_amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={getStatusBadge(selectedPlan.status)}>{selectedPlan.status}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Installments</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Due Date</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedPlan.installments?.map((inst) => (
                      <tr key={inst.installment_id}>
                        <td className="px-4 py-2">{inst.installment_number}</td>
                        <td className="px-4 py-2">{new Date(inst.due_date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">₹{inst.amount}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${inst.status === 'paid' ? 'bg-green-100 text-green-700' :
                            inst.status === 'overdue' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                            {inst.status}
                          </span>
                          {inst.status !== 'paid' && (
                            <button
                              onClick={() => handlePayClick(inst)}
                              className="ml-2 text-xs text-green-600 hover:text-green-800 underline"
                            >
                              Pay
                            </button>
                          )}
                          {inst.status === 'paid' && (
                            <button
                              onClick={() => {
                                const width = 800;
                                const height = 600;
                                const left = (window.screen.width - width) / 2;
                                const top = (window.screen.height - height) / 2;
                                window.open(
                                  `/print/emi-receipt/${inst.installment_id}`,
                                  'Print Receipt',
                                  `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
                                );
                              }}
                              className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Payment"
        size="sm"
      >
        <form onSubmit={handlePaymentSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={paymentFormData.amount}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                className="input-field w-full"
                required
                min="1"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Mode
              </label>
              <select
                value={paymentFormData.payment_mode}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, payment_mode: e.target.value })}
                className="input-field w-full"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={paymentFormData.notes}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
                className="input-field w-full"
                rows="3"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Record Payment
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default EMIManagement;
