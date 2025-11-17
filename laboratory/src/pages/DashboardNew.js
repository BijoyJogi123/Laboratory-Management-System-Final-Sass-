import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import axios from 'axios';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DashboardNew = () => {
  const [stats, setStats] = useState({
    revenue: { total: 0, change: 0 },
    patients: { total: 0, change: 0 },
    tests: { total: 0, change: 0 },
    pending: { total: 0, change: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch various stats
      const [invoiceStats, patients, tests] = await Promise.all([
        axios.get('http://localhost:5000/api/billing/invoices/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/patients/all-patients', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/tests/all-tests', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats({
        revenue: {
          total: invoiceStats.data.data?.total_amount || 0,
          change: 12.5
        },
        patients: {
          total: patients.data.length || 0,
          change: 8.2
        },
        tests: {
          total: tests.data.length || 0,
          change: -3.1
        },
        pending: {
          total: invoiceStats.data.data?.unpaid_count || 0,
          change: -5.4
        }
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {change >= 0 ? (
          <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500">vs last month</span>
      </div>
    </div>
  );

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.total.toLocaleString()}`}
          change={stats.revenue.change}
          icon={CurrencyDollarIcon}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total Patients"
          value={stats.patients.total}
          change={stats.patients.change}
          icon={UserGroupIcon}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Tests Conducted"
          value={stats.tests.total}
          change={stats.tests.change}
          icon={BeakerIcon}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending.total}
          change={stats.pending.change}
          icon={ClipboardDocumentListIcon}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Monthly revenue trends</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm bg-purple-100 text-purple-600 rounded-lg font-medium">
                Month
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
                Year
              </button>
            </div>
          </div>
          
          {/* Simple bar chart visualization */}
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 45, 75, 55, 85, 70, 90, 60, 80, 70, 95, 85].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg transition-all hover:from-purple-600 hover:to-purple-400"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed</p>
                  <p className="text-xs text-gray-500">Tests today</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">24</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Pending</p>
                  <p className="text-xs text-gray-500">Tests today</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-yellow-600">8</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Patients</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Revenue</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600">₹45K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500 mt-1">Latest updates and actions</p>
          </div>
          <button className="text-sm text-purple-600 font-medium hover:text-purple-700">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {[
            { action: 'New invoice created', patient: 'John Doe', time: '5 minutes ago', type: 'invoice' },
            { action: 'Test completed', patient: 'Jane Smith', time: '15 minutes ago', type: 'test' },
            { action: 'Payment received', patient: 'Mike Johnson', time: '1 hour ago', type: 'payment' },
            { action: 'New patient registered', patient: 'Sarah Wilson', time: '2 hours ago', type: 'patient' },
            { action: 'EMI installment paid', patient: 'Robert Brown', time: '3 hours ago', type: 'emi' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'invoice' ? 'bg-purple-100' :
                activity.type === 'test' ? 'bg-green-100' :
                activity.type === 'payment' ? 'bg-blue-100' :
                activity.type === 'patient' ? 'bg-yellow-100' :
                'bg-pink-100'
              }`}>
                <span className="text-sm font-medium">
                  {activity.patient[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.patient}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardNew;
