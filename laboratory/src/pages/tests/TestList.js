import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [formData, setFormData] = useState({
    test_name: '',
    unit: '',
    ref_value: ''
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
    console.log('Submitting test data:', formData);
    
    try {
      const token = localStorage.getItem('token');
      
      if (editingTest) {
        // Update existing test
        await axios.put(`http://localhost:5000/api/tests/test/${editingTest.test_id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Test updated successfully!');
      } else {
        // Create new test
        await axios.post('http://localhost:5000/api/tests/create-test', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Test added successfully!');
      }
      
      setIsModalOpen(false);
      setEditingTest(null);
      setFormData({
        test_name: '',
        unit: '',
        ref_value: ''
      });
      fetchTests();
    } catch (error) {
      console.error('Error saving test:', error);
      
      if (error.response?.status === 401) {
        alert('Session expired. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to save test: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData({
      test_name: test.test_name,
      unit: test.unit,
      ref_value: test.ref_value
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tests/test/${testId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Test deleted successfully!');
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to delete test: ' + (error.response?.data?.message || error.message));
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
                         test.unit?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <MainLayout title="Tests" subtitle="Manage laboratory tests">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Test List</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredTests.length} tests available</p>
          </div>
          <button 
            type="button"
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setEditingTest(null);
              setFormData({ test_name: '', unit: '', ref_value: '' });
              setIsModalOpen(true);
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Test
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by test name or unit..."
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
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Test ID</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Test Name</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Reference Value</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">Loading tests...</td>
                </tr>
              ) : filteredTests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No tests found matching your search' : 'No tests available'}
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test.test_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-purple-600">#{test.test_id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                          <BeakerIcon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{test.test_name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {test.unit}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {test.ref_value}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit Test"
                          onClick={() => handleEdit(test)}
                        >
                          <PencilIcon className="w-4 h-4 text-purple-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Test"
                          onClick={() => handleDelete(test.test_id)}
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

      {/* Add/Edit Test Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTest(null);
          setFormData({ test_name: '', unit: '', ref_value: '' });
        }}
        title={editingTest ? 'Edit Test' : 'Add New Test'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                placeholder="e.g., Hemoglobin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., g/dL, mg/dL, bpm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Value *
              </label>
              <input
                type="text"
                name="ref_value"
                value={formData.ref_value}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., 13.5-17.5, 70-110"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTest(null);
                  setFormData({ test_name: '', unit: '', ref_value: '' });
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                {editingTest ? 'Update Test' : 'Add Test'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default TestList;
