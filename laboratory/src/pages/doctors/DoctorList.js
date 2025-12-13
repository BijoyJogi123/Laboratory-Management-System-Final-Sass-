import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctor_name: '',
    specialization: '',
    qualification: '',
    registration_number: '',
    contact_number: '',
    email: '',
    address: '',
    commission_type: 'none',
    commission_value: 0,
    is_active: true
  });
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    is_active: undefined // Show all doctors by default
  });

  useEffect(() => {
    fetchDoctors();
    fetchStats();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Prepare params, only include is_active if it's not the default 'true'
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.specialization) params.specialization = filters.specialization;
      if (filters.is_active !== true) params.is_active = filters.is_active;
      
      console.log('Fetching doctors with params:', params);
      
      const response = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      
      console.log('Doctors response:', response.data);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      console.log('Submitting doctor data:', formData);
      
      if (editingDoctor) {
        const response = await axios.put(`http://localhost:5000/api/doctors/${editingDoctor.doctor_id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Update response:', response.data);
        alert('Doctor updated successfully!');
      } else {
        const response = await axios.post('http://localhost:5000/api/doctors', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Create response:', response.data);
        alert('Doctor added successfully!');
      }
      
      setIsModalOpen(false);
      setEditingDoctor(null);
      resetForm();
      
      // Force refresh the doctors list
      console.log('Refreshing doctors list...');
      await fetchDoctors();
      await fetchStats();
      
    } catch (error) {
      console.error('Error saving doctor:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to save doctor: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      doctor_name: doctor.doctor_name,
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      registration_number: doctor.registration_number || '',
      contact_number: doctor.contact_number || '',
      email: doctor.email || '',
      address: doctor.address || '',
      commission_type: doctor.commission_type || 'none',
      commission_value: doctor.commission_value || 0,
      is_active: doctor.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Doctor deleted successfully!');
      fetchDoctors();
      fetchStats();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      doctor_name: '',
      specialization: '',
      qualification: '',
      registration_number: '',
      contact_number: '',
      email: '',
      address: '',
      commission_type: 'none',
      commission_value: 0,
      is_active: true
    });
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    resetForm();
    setIsModalOpen(true);
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
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={openAddModal}
          >
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
            value={filters.is_active === true ? 'true' : filters.is_active === false ? 'false' : ''}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({ 
                ...filters, 
                is_active: value === '' ? undefined : value === 'true' 
              });
            }}
          >
            <option value="">All Doctors</option>
            <option value="true">Active Doctors</option>
            <option value="false">Inactive Doctors</option>
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
                  <button 
                    className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1"
                    onClick={() => handleEdit(doctor)}
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    className="btn-danger flex-1 text-sm flex items-center justify-center gap-1"
                    onClick={() => handleDelete(doctor.doctor_id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDoctor(null);
          resetForm();
        }}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General">General Medicine</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="MBBS, MD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="MCI12345"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="+91-9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="doctor@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field w-full"
                rows="3"
                placeholder="Hospital/Clinic address"
              />
            </div>

            {/* Commission Settings */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Commission Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Type
                  </label>
                  <select
                    name="commission_type"
                    value={formData.commission_type}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="none">No Commission</option>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Value
                  </label>
                  <input
                    type="number"
                    name="commission_value"
                    value={formData.commission_value}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder={formData.commission_type === 'percentage' ? '10' : '500'}
                    step="0.01"
                    min="0"
                    disabled={formData.commission_type === 'none'}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">
                Active Doctor
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingDoctor(null);
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
                {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default DoctorList;