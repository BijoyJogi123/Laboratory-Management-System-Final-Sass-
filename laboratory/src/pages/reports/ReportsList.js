import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    from_date: '',
    to_date: ''
  });

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [filters]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/test-orders', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setReports(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/test-orders/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Pending',
        icon: ClockIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      },
      in_progress: {
        label: 'In Progress',
        icon: ClockIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      completed: {
        label: 'Completed',
        icon: CheckCircleIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      cancelled: {
        label: 'Cancelled',
        icon: XCircleIcon,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }
    };
    return configs[status] || configs.pending;
  };

  return (
    <MainLayout title="Test Reports" subtitle="View and manage test reports">
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Reports</p>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_reports || 0}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending</p>
              <ClockIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending_reports || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting results</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">In Progress</p>
              <ClockIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.in_progress_reports || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Being processed</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Completed</p>
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.completed_reports || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Ready to deliver</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reports List</h2>
            <p className="text-sm text-gray-500 mt-1">{reports.length} reports found</p>
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
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient or order ID..."
              className="input-field w-full pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="input-field"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Test/Package</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Order Date</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">Loading reports...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">No reports found</td>
                </tr>
              ) : (
                reports.map((report) => {
                  const statusConfig = getStatusConfig(report.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={report.order_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="text-sm font-medium text-purple-600">{report.order_number}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.patient_name}</p>
                          <p className="text-xs text-gray-500">{report.patient_phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.test_name || report.package_name}</p>
                          <p className="text-xs text-gray-500">{report.test_code || report.package_code}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(report.order_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View Report">
                            <EyeIcon className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-green-50 rounded-lg transition-colors" title="Download Report">
                            <ArrowDownTrayIcon className="w-4 h-4 text-green-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsList;