import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    is_active: true
  });

  useEffect(() => {
    fetchDoctors();
    fetchStats();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setDoctors(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/doctors/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getSpecializationColor = (spec) => {
    const colors = {
      cardiology: 'bg-red-100 text-red-700',
      neurology: 'bg-purple-100 text-purple-700',
      orthopedics: 'bg-blue-100 text-blue-700',
      pediatrics: 'bg-green-100 text-green-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[spec?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <MainLayout title="Doctor Management" subtitle="Manage referring doctors and commissions">
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Doctors</p>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_doctors || 0}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.active_doctors || 0} active</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Referrals</p>
              <ChartBarIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.total_referrals || 0}</p>
            <p className="text-xs text-gray-500 mt-1">This month: {stats.monthly_referrals || 0}</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Commission Paid</p>
              <CurrencyDollarIcon className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600">₹{(stats.total_commission || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total paid</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending Commission</p>
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-yellow-600 text-xs font-bold">₹</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600">₹{(stats.pending_commission || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">To be paid</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Doctors List</h2>
            <p className="text-sm text-gray-500 mt-1">{doctors.length} doctors registered</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Doctor
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="input-field w-full pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="input-field"
            value={filters.specialization}
            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
          >
            <option value="">All Specializations</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="general">General</option>
          </select>
          <select
            className="input-field"
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value === 'true' })}
          >
            <option value="true">Active Doctors</option>
            <option value="false">Inactive Doctors</option>
            <option value="">All Doctors</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-gray-500">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-500">No doctors found</div>
          ) : (
            doctors.map((doctor) => (
              <div key={doctor.doctor_id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl font-bold">
                    {doctor.doctor_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{doctor.doctor_name}</h3>
                    <span className={`badge ${getSpecializationColor(doctor.specialization)} mt-1`}>
                      {doctor.specialization || 'General'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {doctor.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{doctor.email}</span>
                    </div>
                  )}
                  {doctor.address && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{doctor.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Commission Rate</p>
                      <p className="text-sm font-medium text-purple-600">{doctor.commission_rate || 0}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Referrals</p>
                      <p className="text-sm font-medium text-green-600">{doctor.total_referrals || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="btn-secondary flex-1 text-sm">View Details</button>
                  <button className="btn-primary flex-1 text-sm">Edit</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorList;