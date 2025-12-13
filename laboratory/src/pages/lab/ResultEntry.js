import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const ResultEntry = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultData, setResultData] = useState({
    result_value: '',
    result_status: 'normal',
    technician_notes: ''
  });

  useEffect(() => {
    fetchPendingReports();
  }, [statusFilter]);

  const fetchPendingReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/reports?status=${statusFilter}`, {
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

  const openResultEntry = (test) => {
    setSelectedTest(test);
    setResultData({
      result_value: test.result_value || '',
      result_status: test.result_status || 'normal',
      technician_notes: test.technician_notes || ''
    });
    setIsResultModalOpen(true);
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:5000/api/reports/${selectedReport.report_id}/tests/${selectedTest.test_id}/results`,
        resultData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Result saved successfully!');
      setIsResultModalOpen(false);
      fetchReportDetails(selectedReport.report_id);
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Failed to save result: ' + (error.response?.data?.message || error.message));
    }
  };

  const markReportCompleted = async (reportId) => {
    if (!window.confirm('Mark this report as completed? All test results should be entered.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/reports/${reportId}/status`,
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Report marked as completed!');
      setSelectedReport(null);
      fetchPendingReports();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
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

  const isResultComplete = (test) => {
    return test.result_value && test.result_value.trim() !== '';
  };

  const getReportProgress = (tests) => {
    if (!tests || tests.length === 0) return 0;
    const completedTests = tests.filter(test => isResultComplete(test));
    return Math.round((completedTests.length / tests.length) * 100);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report_id?.toString().includes(searchTerm);
    return matchesSearch;
  });

  return (
    <MainLayout title="Result Entry" subtitle="Enter test results and manage laboratory workflow">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending Results</p>
            <ClockIcon className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {reports.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Awaiting entry</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">In Progress</p>
            <ExclamationTriangleIcon className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {reports.filter(r => r.status === 'in_progress').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Being processed</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completed Today</p>
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === 'completed' && 
              new Date(r.completed_at || r.updated_at).toDateString() === new Date().toDateString()
            ).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Ready for verification</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">My Workload</p>
            <BeakerIcon className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {reports.filter(r => ['pending', 'in_progress'].includes(r.status)).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total pending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reports Queue</h2>
              <p className="text-sm text-gray-500 mt-1">Select a report to enter results</p>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="pending">Pending Results</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading reports...</div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No reports found for {statusFilter} status
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.report_id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport?.report_id === report.report_id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
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
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{report.test_count} tests</span>
                    <span>{new Date(report.report_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Result Entry Panel */}
        <div className="card">
          {selectedReport ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Result Entry</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedReport.patient_name} - Report #{selectedReport.report_id}
                  </p>
                </div>
                {selectedReport.status === 'in_progress' && (
                  <button
                    onClick={() => markReportCompleted(selectedReport.report_id)}
                    className="btn-primary text-sm"
                  >
                    Mark Completed
                  </button>
                )}
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Patient:</span>
                    <span className="ml-2 font-medium">{selectedReport.patient_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <span className="ml-2 font-medium">{selectedReport.patient_age}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Doctor:</span>
                    <span className="ml-2 font-medium">{selectedReport.doctor_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sample Date:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedReport.sample_collection_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {selectedReport.tests && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="text-sm font-medium">
                        {getReportProgress(selectedReport.tests)}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${getReportProgress(selectedReport.tests)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 mb-3">Test Results</h3>
                {selectedReport.tests && selectedReport.tests.length > 0 ? (
                  selectedReport.tests.map((test) => (
                    <div key={test.test_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{test.test_name}</h4>
                          <p className="text-sm text-gray-500">
                            Reference: {test.ref_value || 'Not specified'}
                            {test.unit && ` (${test.unit})`}
                          </p>
                        </div>
                        <button
                          onClick={() => openResultEntry(test)}
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Enter Result"
                        >
                          <PencilIcon className="w-4 h-4 text-purple-600" />
                        </button>
                      </div>
                      
                      {isResultComplete(test) ? (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">Result: {test.result_value}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getResultStatusColor(test.result_status)}`}>
                              {test.result_status?.toUpperCase()}
                            </span>
                          </div>
                          {test.technician_notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              Note: {test.technician_notes}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 p-3 border-2 border-dashed border-gray-300 rounded text-center">
                          <p className="text-sm text-gray-500">Click to enter result</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tests found for this report
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BeakerIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a report from the list to enter results</p>
            </div>
          )}
        </div>
      </div>

      {/* Result Entry Modal */}
      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title={`Enter Result - ${selectedTest?.test_name}`}
        size="md"
      >
        {selectedTest && (
          <form onSubmit={handleResultSubmit}>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedTest.test_name}</h4>
                <div className="text-sm text-gray-600">
                  <p>Reference Range: {selectedTest.ref_value || 'Not specified'}</p>
                  {selectedTest.unit && <p>Unit: {selectedTest.unit}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result Value *
                </label>
                <input
                  type="text"
                  value={resultData.result_value}
                  onChange={(e) => setResultData({ ...resultData, result_value: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter result value"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result Status
                </label>
                <select
                  value={resultData.result_status}
                  onChange={(e) => setResultData({ ...resultData, result_status: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technician Notes
                </label>
                <textarea
                  value={resultData.technician_notes}
                  onChange={(e) => setResultData({ ...resultData, technician_notes: e.target.value })}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Add any notes about the test result..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsResultModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Save Result
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </MainLayout>
  );
};

export default ResultEntry;