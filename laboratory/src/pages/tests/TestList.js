import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    test_name: '',
    test_code: '',
    category: 'hematology',
    price: '',
    tat_hours: '24',
    sample_type: 'Blood',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tests/all-tests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({
        test_name: '',
        test_code: '',
        category: 'hematology',
        price: '',
        tat_hours: '24',
        sample_type: 'Blood',
        description: ''
      });
      fetchTests();
      alert('Test added successfully!');
    } catch (error) {
      console.error('Error adding test:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to add test');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.test_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.test_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || test.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      hematology: 'bg-red-100 text-red-700',
      biochemistry: 'bg-blue-100 text-blue-700',
      microbiology: 'bg-green-100 text-green-700',
      pathology: 'bg-purple-100 text-purple-700',
      radiology: 'bg-yellow-100 text-yellow-700'
    };
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <MainLayout title="Tests" subtitle="Manage laboratory tests and pricing">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Test List</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredTests.length} tests available</p>
          </div>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Add Test
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by test name or code..."
              className="input-field w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="hematology">Hematology</option>
            <option value="biochemistry">Biochemistry</option>
            <option value="microbiology">Microbiology</option>
            <option value="pathology">Pathology</option>
            <option value="radiology">Radiology</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Test Code</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Test Name</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">TAT</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Sample Type</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">Loading tests...</td>
                </tr>
              ) : filteredTests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    {searchTerm || categoryFilter ? 'No tests found matching your criteria' : 'No tests available'}
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test.test_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-purple-600">{test.test_code}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                          <BeakerIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{test.test_name}</p>
                          {test.description && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">{test.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge ${getCategoryColor(test.category)}`}>
                        {test.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
                        {test.price ? test.price.toLocaleString() : 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        {test.tat_hours || 24}h
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {test.sample_type || 'Blood'}
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit Test"
                        onClick={() => navigate(`/new-test?id=${test.test_id}`)}
                      >
                        <PencilIcon className="w-4 h-4 text-purple-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Test Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Test"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Name *
                </label>
                <input
                  type="text"
                  name="test_name"
                  value={formData.test_name}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Code *
                </label>
                <input
                  type="text"
                  name="test_code"
                  value={formData.test_code}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="hematology">Hematology</option>
                  <option value="biochemistry">Biochemistry</option>
                  <option value="microbiology">Microbiology</option>
                  <option value="pathology">Pathology</option>
                  <option value="radiology">Radiology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TAT (Hours) *
                </label>
                <input
                  type="number"
                  name="tat_hours"
                  value={formData.tat_hours}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Type *
                </label>
                <select
                  name="sample_type"
                  value={formData.sample_type}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="Blood">Blood</option>
                  <option value="Urine">Urine</option>
                  <option value="Stool">Stool</option>
                  <option value="Saliva">Saliva</option>
                  <option value="Tissue">Tissue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
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
                Add Test
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default TestList;
