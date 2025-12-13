import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  PencilIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const VerificationDashboard = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationData, setVerificationData] = useState({
    doctor_comments: '',
    action: 'verify' // 'verify' or 'reject'
  });

  useEffect(() => {
    fetchCompletedReports();
  }, []);

  const fetchCompletedReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports?status=completed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const fetchReportDetails = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedReport(response.data.data);
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };

  const openVerificationModal = (action = 'verify') => {
    setVerificationData({
      doctor_comments: '',
      action: action
    });
    setIsVerificationModalOpen(true);
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const newStatus = verificationData.action === 'verify' ? 'verified' : 'in_progress';
      
      await axios.put(
        `http://localhost:5000/api/reports/${selectedReport.report_id}/status`,
        { 
          status: newStatus,
          doctor_comments: verificationData.doctor_comments
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const actionText = verificationData.action === 'verify' ? 'verified' : 'sent back for revision';
      alert(`Report ${actionText} successfully!`);
      
      // Remove the processed report from the current list instead of refetching
      setReports(prevReports => 
        prevReports.filter(report => report.report_id !== selectedReport.report_id)
      );
      
      setIsVerificationModalOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Failed to update verification status');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'stat':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'abnormal':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const hasAbnormalResults = (tests) => {
    return tests && tests.some(test => test.result_status === 'abnormal' || test.result_status === 'critical');
  };

  const getCriticalCount = (tests) => {
    return tests ? tests.filter(test => test.result_status === 'critical').length : 0;
  };

  const getAbnormalCount = (tests) => {
    return tests ? tests.filter(test => test.result_status === 'abnormal').length : 0;
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report_id?.toString().includes(searchTerm);
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Sort by priority (STAT first, then urgent, then normal)
  const sortedReports = filteredReports.sort((a, b) => {
    const priorityOrder = { 'stat': 0, 'urgent': 1, 'normal': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <MainLayout title="Doctor Verification" subtitle="Review and verify laboratory test results">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending Verification</p>
            <ClockIcon className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{reports.length}</p>
          <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">STAT Priority</p>
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {reports.filter(r => r.priority === 'stat').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Urgent attention</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Abnormal Results</p>
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {reports.filter(r => hasAbnormalResults(r.tests)).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Need attention</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Today's Verifications</p>
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">0</p>
          <p className="text-xs text-gray-500 mt-1">Completed today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Queue */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verification Queue</h2>
              <p className="text-sm text-gray-500 mt-1">Reports awaiting doctor verification</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
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
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="stat">STAT</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading reports...</div>
            ) : sortedReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No reports pending verification
              </div>
            ) : (
              sortedReports.map((report) => (
                <div
                  key={report.report_id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport?.report_id === report.report_id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${report.priority === 'stat' ? 'border-l-4 border-l-red-500' : 
                      report.priority === 'urgent' ? 'border-l-4 border-l-orange-500' : ''}`}
                  onClick={() => fetchReportDetails(report.report_id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.patient_name}</p>
                        <p className="text-sm text-gray-500">Report #{report.report_id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(report.priority)}`}>
                        {report.priority?.toUpperCase()}
                      </span>
                      {hasAbnormalResults(report.tests) && (
                        <span className="text-xs text-orange-600 font-medium">
                          ⚠️ Abnormal
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{report.test_count} tests</span>
                    <span>{new Date(report.completed_at || report.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Verification Panel */}
        <div className="card">
          {selectedReport ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Report Review</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedReport.patient_name} - Report #{selectedReport.report_id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openVerificationModal('reject')}
                    className="btn-secondary text-sm flex items-center gap-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Send Back
                  </button>
                  <button
                    onClick={() => openVerificationModal('verify')}
                    className="btn-primary text-sm flex items-center gap-1"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Verify & Approve
                  </button>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Patient:</span>
                    <span className="ml-2 font-medium">{selectedReport.patient_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Age/Gender:</span>
                    <span className="ml-2 font-medium">{selectedReport.patient_age}/{selectedReport.patient_gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Referring Doctor:</span>
                    <span className="ml-2 font-medium">{selectedReport.doctor_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sample Date:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedReport.sample_collection_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getPriorityColor(selectedReport.priority)}`}>
                    {selectedReport.priority?.toUpperCase()} Priority
                  </span>
                  <div className="flex gap-4 text-sm">
                    {getCriticalCount(selectedReport.tests) > 0 && (
                      <span className="text-red-600 font-medium">
                        🔴 {getCriticalCount(selectedReport.tests)} Critical
                      </span>
                    )}
                    {getAbnormalCount(selectedReport.tests) > 0 && (
                      <span className="text-orange-600 font-medium">
                        🟡 {getAbnormalCount(selectedReport.tests)} Abnormal
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 mb-3">Test Results Review</h3>
                {selectedReport.tests && selectedReport.tests.length > 0 ? (
                  selectedReport.tests.map((test) => (
                    <div key={test.test_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{test.test_name}</h4>
                          <p className="text-sm text-gray-500">
                            Reference: {test.ref_value || 'Not specified'}
                            {test.unit && ` (${test.unit})`}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getResultStatusColor(test.result_status)}`}>
                          {test.result_status?.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold text-gray-900">
                            Result: {test.result_value}
                            {test.unit && ` ${test.unit}`}
                          </span>
                          {(test.result_status === 'abnormal' || test.result_status === 'critical') && (
                            <span className="text-sm text-red-600 font-medium">
                              ⚠️ Requires Attention
                            </span>
                          )}
                        </div>
                        {test.technician_notes && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Technician Note:</span> {test.technician_notes}
                            </p>
                          </div>
                        )}
                        {test.entered_at && (
                          <p className="text-xs text-gray-500 mt-2">
                            Entered: {new Date(test.entered_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No test results found
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a report from the queue to review results</p>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      <Modal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        title={verificationData.action === 'verify' ? 'Verify Report' : 'Send Back for Revision'}
        size="md"
      >
        {selectedReport && (
          <form onSubmit={handleVerification}>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedReport.patient_name} - Report #{selectedReport.report_id}
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedReport.tests?.length} tests completed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Comments {verificationData.action === 'verify' ? '(Optional)' : '*'}
                </label>
                <textarea
                  value={verificationData.doctor_comments}
                  onChange={(e) => setVerificationData({ 
                    ...verificationData, 
                    doctor_comments: e.target.value 
                  })}
                  className="input-field w-full"
                  rows="4"
                  placeholder={
                    verificationData.action === 'verify' 
                      ? "Add any recommendations or observations..."
                      : "Explain why this report needs revision..."
                  }
                  required={verificationData.action === 'reject'}
                />
              </div>

              {verificationData.action === 'verify' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    ✅ This will mark the report as verified and generate the final PDF report.
                  </p>
                </div>
              )}

              {verificationData.action === 'reject' && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                  <p className="text-sm text-orange-800">
                    ⚠️ This will send the report back to the technician for revision.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 ${
                    verificationData.action === 'verify' 
                      ? 'btn-primary' 
                      : 'bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700'
                  }`}
                >
                  {verificationData.action === 'verify' ? 'Verify & Approve' : 'Send Back'}
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </MainLayout>
  );
};

export default VerificationDashboard;