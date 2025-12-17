import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import axios from 'axios';
import {
  DocumentArrowDownIcon,
  PrinterIcon,
  EyeIcon,
  ShareIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const ReportViewer = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [labSettings, setLabSettings] = useState(null);

  useEffect(() => {
    fetchVerifiedReports();
    fetchLabSettings();
  }, []);

  const fetchLabSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/settings/lab-info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLabSettings(response.data);
    } catch (error) {
      console.error('Error fetching lab settings:', error);
      setLabSettings({
        lab_name: 'LabHub Medical Laboratory',
        address: '123 Medical Street, Healthcare City',
        phone: '+91-1234567890',
        email: 'reports@labhub.com',
        website: 'www.labhub.com',
        license_number: 'LAB-2024-001',
        logo_url: null
      });
    }
  };

  const fetchVerifiedReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports?status=verified', {
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

  const generatePDF = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/reports/${reportId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    }
  };

  const printReport = () => {
    window.print();
  };

  const getResultStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'abnormal':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report_id?.toString().includes(searchTerm);
    return matchesSearch;
  });

  return (
    <MainLayout title="Report Viewer" subtitle="View and download verified laboratory reports">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Verified Reports</p>
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{reports.length}</p>
          <p className="text-xs text-gray-500 mt-1">Ready for delivery</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Today's Reports</p>
            <CalendarIcon className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {reports.filter(r => 
              new Date(r.verified_at || r.updated_at).toDateString() === new Date().toDateString()
            ).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Verified today</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">This Week</p>
            <CalendarIcon className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {reports.filter(r => {
              const reportDate = new Date(r.verified_at || r.updated_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return reportDate >= weekAgo;
            }).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Downloads</p>
            <DocumentArrowDownIcon className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-600">0</p>
          <p className="text-xs text-gray-500 mt-1">PDF downloads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verified Reports</h2>
              <p className="text-sm text-gray-500 mt-1">Ready for patient delivery</p>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search reports..."
              className="input-field w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading reports...</div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No verified reports found
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.report_id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport?.report_id === report.report_id
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => fetchReportDetails(report.report_id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.patient_name}</p>
                        <p className="text-sm text-gray-500">Report #{report.report_id}</p>
                      </div>
                    </div>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{report.test_count} tests</span>
                    <span>{new Date(report.verified_at || report.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2 card">
          {selectedReport ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Report Preview</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Report #{selectedReport.report_id} - {selectedReport.patient_name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={printReport}
                    className="btn-secondary text-sm flex items-center gap-1"
                  >
                    <PrinterIcon className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={() => generatePDF(selectedReport.report_id)}
                    className="btn-primary text-sm flex items-center gap-1"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Report Content */}
              <div className="bg-white border rounded-lg p-8 print:shadow-none print:border-none">
                {/* Header */}
                <div className="text-center mb-8 border-b pb-6">
                  {labSettings?.logo_url && (
                    <div className="mb-4">
                      <img
                        src={`http://localhost:5000${labSettings.logo_url}`}
                        alt="Laboratory Logo"
                        className="h-20 w-auto object-contain mx-auto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">LABORATORY REPORT</h1>
                  <div className="text-lg text-gray-600">
                    <p className="font-semibold">{labSettings?.lab_name || 'LabHub Medical Laboratory'}</p>
                    <p className="text-sm">{labSettings?.address || '123 Medical Street, Healthcare City'}</p>
                    <p className="text-sm">
                      Phone: {labSettings?.phone || '+91-1234567890'} | Email: {labSettings?.email || 'reports@labhub.com'}
                    </p>
                    {labSettings?.website && (
                      <p className="text-sm">Website: {labSettings.website}</p>
                    )}
                    {labSettings?.license_number && (
                      <p className="text-sm">License: {labSettings.license_number}</p>
                    )}
                  </div>
                </div>

                {/* Patient Information */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="w-24 text-gray-600">Name:</span>
                        <span className="font-medium">{selectedReport.patient_name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-gray-600">Age:</span>
                        <span className="font-medium">{selectedReport.patient_age} years</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-gray-600">Gender:</span>
                        <span className="font-medium">{selectedReport.patient_gender}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedReport.patient_phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Report Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="w-32 text-gray-600">Report ID:</span>
                        <span className="font-medium">#{selectedReport.report_id}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-600">Sample Date:</span>
                        <span className="font-medium">
                          {new Date(selectedReport.sample_collection_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-600">Report Date:</span>
                        <span className="font-medium">
                          {new Date(selectedReport.report_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-600">Referring Doctor:</span>
                        <span className="font-medium">{selectedReport.doctor_name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Investigation Results</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Test Name</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Result</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Unit</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Reference Range</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.tests && selectedReport.tests.map((test) => (
                          <tr key={test.test_id}>
                            <td className="border border-gray-300 px-4 py-3">{test.test_name}</td>
                            <td className="border border-gray-300 px-4 py-3 font-semibold">
                              {test.result_value}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">{test.unit || '-'}</td>
                            <td className="border border-gray-300 px-4 py-3">{test.ref_value || '-'}</td>
                            <td className={`border border-gray-300 px-4 py-3 font-medium ${getResultStatusColor(test.result_status)}`}>
                              {test.result_status?.toUpperCase()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Doctor Comments */}
                {selectedReport.doctor_comments && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-3">Doctor's Comments</h3>
                    <div className="bg-gray-50 p-4 rounded border">
                      <p className="text-sm text-gray-700">{selectedReport.doctor_comments}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t pt-6 mt-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-600">
                        Verified by: <span className="font-medium">Dr. Pathologist</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(selectedReport.verified_at || selectedReport.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-gray-400 w-32 mb-1"></div>
                      <p className="text-sm text-gray-600">Digital Signature</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center text-xs text-gray-500">
                    <p>This is a computer-generated report and does not require a physical signature.</p>
                    <p>For any queries, please contact us at {labSettings?.phone || '+91-1234567890'}</p>
                    {labSettings?.email && (
                      <p>Email: {labSettings.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <EyeIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a report to view and download</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportViewer;