import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    email: '',
    gender: 'male',
    age: '',
    address: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/patients/all-patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        alert('Please login again');
        return;
      }

      console.log('Sending request to backend...');
      const response = await axios.post('http://localhost:5000/api/patients', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response:', response.data);
      
      setIsModalOpen(false);
      setFormData({
        patient_name: '',
        phone: '',
        email: '',
        gender: 'male',
        age: '',
        address: ''
      });
      
      await fetchPatients();
      alert('Patient added successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        alert('Session expired. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 500) {
        alert('Server error. Please check if backend is running.');
      } else {
        alert(`Failed to add patient: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGenderColor = (gender) => {
    const colors = {
      male: 'bg-blue-100 text-blue-700',
      female: 'bg-pink-100 text-pink-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[gender?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <MainLayout title="Patients" subtitle="Manage patient records and information">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Patient List</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredPatients.length} patients found</p>
          </div>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Add Patient
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              className="input-field w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Age</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Registration Date</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">Loading patients...</td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No patients found matching your search' : 'No patients registered yet'}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.patient_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-purple-600">{patient.patient_id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium">
                          {patient.patient_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{patient.patient_name}</p>
                          {patient.email && (
                            <p className="text-xs text-gray-500">{patient.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        {patient.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge ${getGenderColor(patient.gender)}`}>
                        {patient.gender || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {patient.age || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {patient.created_at ? new Date(patient.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                          onClick={() => navigate(`/patient/${patient.patient_id}`)}
                        >
                          <EyeIcon className="w-4 h-4 text-blue-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit Patient"
                          onClick={() => navigate(`/patient-entry?id=${patient.patient_id}`)}
                        >
                          <PencilIcon className="w-4 h-4 text-purple-600" />
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

      {/* Add Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Patient"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
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
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                  min="0"
                  max="150"
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
              ></textarea>
            </div>

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
              >
                Add Patient
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default PatientList;
