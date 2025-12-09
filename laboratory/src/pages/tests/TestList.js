import React, { useState, useEffect } from 'react';
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
    ref_value: '',
    test_type: 'single',
    price: ''
  });
  const [subTests, setSubTests] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
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
    
    // Validate group test has sub-tests
    if (formData.test_type === 'group' && subTests.length === 0) {
      alert('Group test must have at least one sub-test');
      return;
    }
    
    const submitData = {
      ...formData,
      subTests: formData.test_type === 'group' ? subTests : []
    };
    
    console.log('Submitting test data:', submitData);
    
    try {
      const token = localStorage.getItem('token');
      
      if (editingTest) {
        // Update existing test
        await axios.put(`http://localhost:5000/api/tests/${editingTest.test_id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Test updated successfully!');
      } else {
        // Create new test - use appropriate endpoint
        const endpoint = formData.test_type === 'group' 
          ? 'http://localhost:5000/api/tests/add-group-test'
          : 'http://localhost:5000/api/tests/add-test';
          
        await axios.post(endpoint, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert(`${formData.test_type === 'group' ? 'Group test' : 'Test'} added successfully!`);
      }
      
      setIsModalOpen(false);
      setEditingTest(null);
      setFormData({
        test_name: '',
        unit: '',
        ref_value: '',
        test_type: 'single',
        price: ''
      });
      setSubTests([]);
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
      unit: test.unit || '',
      ref_value: test.ref_value || '',
      test_type: test.test_type || 'single',
      price: test.price || ''
    });
    
    // Load sub-tests if it's a group test
    if (test.test_type === 'group' && test.subTests) {
      setSubTests(test.subTests.map(subTest => ({
        name: subTest.test_name,
        unit: subTest.unit || '',
        ref_value: subTest.ref_value || ''
      })));
    } else {
      setSubTests([]);
    }
    
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

  const toggleGroupExpansion = (testId) => {
    setExpandedGroups(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Reset sub-tests when switching to single test
    if (name === 'test_type' && value === 'single') {
      setSubTests([]);
    }
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
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase w-12"></th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Test ID</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Test Name</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Reference Value</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">Loading tests...</td>
                </tr>
              ) : filteredTests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No tests found matching your search' : 'No tests available'}
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <React.Fragment key={test.test_id}>
                    {/* Main Test Row */}
                    <tr className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${test.test_type === 'group' ? 'bg-purple-50/30' : ''}`}>
                      <td className="py-4 px-4">
                        {test.test_type === 'group' && test.subTests && test.subTests.length > 0 && (
                          <button
                            onClick={() => toggleGroupExpansion(test.test_id)}
                            className="p-1 hover:bg-purple-100 rounded transition-colors"
                            title={expandedGroups.includes(test.test_id) ? 'Collapse' : 'Expand'}
                          >
                            <svg 
                              className={`w-4 h-4 text-purple-600 transition-transform ${expandedGroups.includes(test.test_id) ? 'rotate-90' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-purple-600">#{test.test_id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${test.test_type === 'group' ? 'bg-gradient-to-br from-blue-400 to-purple-500' : 'bg-gradient-to-br from-purple-400 to-pink-400'} flex items-center justify-center`}>
                            {test.test_type === 'group' ? (
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            ) : (
                              <BeakerIcon className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{test.test_name}</p>
                            {test.test_type === 'group' && test.subTests && (
                              <p className="text-xs text-gray-500">{test.subTests.length} sub-tests</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          test.test_type === 'group' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {test.test_type === 'group' ? 'Package' : 'Single'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        ₹{parseFloat(test.price || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {test.test_type === 'single' ? test.unit || '-' : '-'}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {test.test_type === 'single' ? test.ref_value || '-' : '-'}
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

                    {/* Sub-Tests Rows (Expandable) */}
                    {test.test_type === 'group' && test.subTests && expandedGroups.includes(test.test_id) && (
                      test.subTests.map((subTest, index) => (
                        <tr key={`sub-${test.test_id}-${index}`} className="bg-gray-50/50 border-b border-gray-100">
                          <td className="py-3 px-4"></td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-400">#{subTest.test_id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 pl-8">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className="text-sm text-gray-700">{subTest.test_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-500">Sub-test</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-400">-</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {subTest.unit || '-'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {subTest.ref_value || '-'}
                          </td>
                          <td className="py-3 px-4"></td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
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
          setFormData({ 
            test_name: '', 
            unit: '', 
            ref_value: '',
            test_type: 'single',
            price: ''
          });
          setSubTests([]);
        }}
        title={editingTest ? 'Edit Test' : 'Add New Test'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Test Name */}
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
                placeholder="e.g., Blood Sugar or Complete Blood Count"
                required
              />
            </div>

            {/* Test Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type *
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="test_type"
                    value="single"
                    checked={formData.test_type === 'single'}
                    onChange={handleInputChange}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Single Test</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="test_type"
                    value="group"
                    checked={formData.test_type === 'group'}
                    onChange={handleInputChange}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Group Test (Package)</span>
                </label>
              </div>
            </div>

            {/* Price Field */}
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
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Single Test Fields */}
            {formData.test_type === 'single' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="e.g., mg/dL, %"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Value
                  </label>
                  <input
                    type="text"
                    name="ref_value"
                    value={formData.ref_value}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="e.g., 70-100"
                  />
                </div>
              </div>
            )}

            {/* Group Test Sub-Tests */}
            {formData.test_type === 'group' && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Sub-Tests</h4>
                  <button
                    type="button"
                    onClick={() => setSubTests([...subTests, { name: '', unit: '', ref_value: '' }])}
                    className="btn-secondary text-sm"
                  >
                    + Add Sub-Test
                  </button>
                </div>
                
                {subTests.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No sub-tests added yet. Click "Add Sub-Test" to get started.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {subTests.map((subTest, index) => (
                      <div key={index} className="flex gap-2 items-end p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Sub-Test Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., RBC Count"
                            value={subTest.name}
                            onChange={(e) => {
                              const updated = [...subTests];
                              updated[index].name = e.target.value;
                              setSubTests(updated);
                            }}
                            className="input-field w-full text-sm"
                            required
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            placeholder="mg/dL"
                            value={subTest.unit}
                            onChange={(e) => {
                              const updated = [...subTests];
                              updated[index].unit = e.target.value;
                              setSubTests(updated);
                            }}
                            className="input-field w-full text-sm"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Ref Value
                          </label>
                          <input
                            type="text"
                            placeholder="70-100"
                            value={subTest.ref_value}
                            onChange={(e) => {
                              const updated = [...subTests];
                              updated[index].ref_value = e.target.value;
                              setSubTests(updated);
                            }}
                            className="input-field w-full text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setSubTests(subTests.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                          title="Remove sub-test"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTest(null);
                  setFormData({ 
                    test_name: '', 
                    unit: '', 
                    ref_value: '',
                    test_type: 'single',
                    price: ''
                  });
                  setSubTests([]);
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
