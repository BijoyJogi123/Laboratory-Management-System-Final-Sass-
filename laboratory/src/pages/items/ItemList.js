import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    item_code: '',
    category: 'reagent',
    current_stock: '',
    min_stock_level: '',
    unit_price: '',
    unit: 'pcs',
    description: '',
    is_active: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/items/all-items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/items', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({
        item_name: '',
        item_code: '',
        category: 'reagent',
        current_stock: '',
        min_stock_level: '',
        unit_price: '',
        unit: 'pcs',
        description: '',
        is_active: true
      });
      fetchItems();
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to add item');
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.item_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      reagent: 'bg-purple-100 text-purple-700',
      consumable: 'bg-blue-100 text-blue-700',
      equipment: 'bg-green-100 text-green-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const getStockStatus = (currentStock, minLevel) => {
    if (currentStock <= 0) {
      return { label: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (currentStock <= minLevel) {
      return { label: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { label: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  return (
    <MainLayout title="Items" subtitle="Manage inventory items and stock">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Item List</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredItems.length} items available</p>
          </div>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item name or code..."
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
            <option value="reagent">Reagents</option>
            <option value="consumable">Consumables</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Item Code</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Item Name</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Min Level</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">Loading items...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    {searchTerm || categoryFilter ? 'No items found matching your criteria' : 'No items available'}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item.current_stock, item.min_stock_level);
                  return (
                    <tr key={item.item_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-purple-600">{item.item_code}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                            <CubeIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.item_name}</p>
                            {item.description && (
                              <p className="text-xs text-gray-500 truncate max-w-xs">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${getCategoryColor(item.category)}`}>
                          {item.category || 'Other'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">
                          {item.current_stock || 0} {item.unit}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {item.min_stock_level || 0} {item.unit}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        ₹{item.unit_price ? item.unit_price.toLocaleString() : '0'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${stockStatus.bgColor} ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit Item"
                          onClick={() => navigate(`/new-item?id=${item.item_id}`)}
                        >
                          <PencilIcon className="w-4 h-4 text-purple-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Item"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Code *
                </label>
                <input
                  type="text"
                  name="item_code"
                  value={formData.item_code}
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
                  <option value="reagent">Reagent</option>
                  <option value="consumable">Consumable</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="pcs">Pieces</option>
                  <option value="ml">Milliliters</option>
                  <option value="l">Liters</option>
                  <option value="g">Grams</option>
                  <option value="kg">Kilograms</option>
                  <option value="box">Box</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock *
                </label>
                <input
                  type="number"
                  name="current_stock"
                  value={formData.current_stock}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Stock Level *
                </label>
                <input
                  type="number"
                  name="min_stock_level"
                  value={formData.min_stock_level}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price (₹) *
              </label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleInputChange}
                className="input-field w-full"
                required
                min="0"
                step="0.01"
              />
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <label className="text-sm text-gray-700">
                Active
              </label>
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
                Add Item
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default ItemList;
