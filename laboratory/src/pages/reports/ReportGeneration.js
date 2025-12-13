import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentChartBarIcon,
  EyeIcon,
  PrinterIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  BeakerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ReportGeneration = () => {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    test_ids: [],
    report_date: new Date().toISOString().split('T')[0],
    sample_collection_date: new Date().toISOString().split('T')[0],
    notes: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchReports();
    fetchPatients();
    fetchDoctors();
    fetchTests();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching patients...');
      const response = await axios.get('http://localhost:5000/api/patients/all-patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Patients response:', response.data);
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching doctors...');
      const response = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Doctors response:', response.data);
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching tests...');
      const response = await axios.get('http://localhost:5000/api/tests/all-tests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Tests response:', response.data);
      setTests(response.data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'test_ids') {
      const testId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        test_ids: checked 
          ? [...prev.test_ids, testId]
          : prev.test_ids.filter(id => id !== testId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/reports', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Report generated successfully!');
      setIsModalOpen(false);
      resetForm();
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      test_ids: [],
      report_date: new Date().toISOString().split('T')[0],
      sample_collection_date: new Date().toISOString().split('T')[0],
      notes: '',
      priority: 'normal'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'verified':
        return <CheckCircleIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'verified':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/reports/${reportId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReports();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report_id?.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout title="Report Generation" subtitle="Generate and manage laboratory test reports">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Reports</p>
            <DocumentChartBarIcon className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending Reports</p>
            <ClockIcon className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {reports.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completed Reports</p>
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === 'completed' || r.status === 'verified').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Ready for delivery</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Today's Reports</p>
            <CalendarIcon className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {reports.filter(r => 
              new Date(r.report_date).toDateString() === new Date().toDateString()
            ).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Generated today</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Laboratory Reports</h2>
            <p className="text-sm text-gray-500 mt-1">Generate and manage test reports</p>
          </div>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              className="input-field w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="verified">Verified</option>
          </select>
          <div></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Report ID</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Tests</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">Loading reports...</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No reports found matching your search' : 'No reports generated yet'}
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.report_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-purple-600">#{report.report_id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.patient_name}</p>
                          <p className="text-xs text-gray-500">Age: {report.patient_age}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <BeakerIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{report.test_count} tests</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{report.doctor_name}</p>
                      <p className="text-xs text-gray-500">{report.doctor_specialization}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{new Date(report.report_date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Sample: {new Date(report.sample_collection_date).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span className={`badge ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Report"
                          onClick={() => setSelectedReport(report)}
                        >
                          <EyeIcon className="w-4 h-4 text-blue-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Print Report"
                        >
                          <PrinterIcon className="w-4 h-4 text-green-600" />
                        </button>
                        <select
                          className="text-xs border rounded px-2 py-1"
                          value={report.status}
                          onChange={(e) => updateReportStatus(report.report_id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="verified">Verified</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Generate New Report"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.patient_name} - {patient.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referring Doctor *
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.doctor_name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Test Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tests *
              </label>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                {tests.map(test => (
                  <label key={test.test_id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="test_ids"
                      value={test.test_id}
                      checked={formData.test_ids.includes(test.test_id)}
                      onChange={handleInputChange}
                      className="rounded text-purple-600"
                    />
                    <span className="text-sm">
                      {test.test_name} 
                      {test.test_type === 'group' && (
                        <span className="text-xs text-blue-600 ml-1">(Package)</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Collection Date *
                </label>
                <input
                  type="date"
                  name="sample_collection_date"
                  value={formData.sample_collection_date}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Date *
                </label>
                <input
                  type="date"
                  name="report_date"
                  value={formData.report_date}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="input-field w-full"
                rows="3"
                placeholder="Additional notes or instructions..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Generate Report
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default ReportGeneration;