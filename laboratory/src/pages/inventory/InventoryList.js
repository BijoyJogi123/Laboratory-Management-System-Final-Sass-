import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CubeIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const itemsResponse = await axios.get('http://localhost:5000/api/inventory/items', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setItems(itemsResponse.data.data || itemsResponse.data);

      const lowStockResponse = await axios.get('http://localhost:5000/api/inventory/low-stock', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLowStockItems(lowStockResponse.data.data || lowStockResponse.data);

      const expiringResponse = await axios.get('http://localhost:5000/api/inventory/expiring', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpiringItems(expiringResponse.data.data || expiringResponse.data);

      const statsResponse = await axios.get('http://localhost:5000/api/inventory/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      reagent: 'bg-purple-100 text-purple-700',
      consumable: 'bg-blue-100 text-blue-700',
      equipment: 'bg-green-100 text-green-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStockStatus = (currentStock, minLevel) => {
    if (currentStock <= 0) {
      return { status: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (currentStock <= minLevel) {
      return { status: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { status: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  return (
    <MainLayout title="Inventory Management" subtitle="Track stock levels, expiry dates, and usage">
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Items</p>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <CubeIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_items || 0}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.active_items || 0} active items</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Low Stock</p>
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.low_stock_items || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Items need restocking</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <ClockIcon className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{expiringItems.length}</p>
            <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Value</p>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">₹</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{(stats.total_value || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Inventory value</p>
          </div>
        </div>
      )}

      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          {lowStockItems.length > 0 && (
            <div className="card border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Low Stock Alert</h3>
                  <p className="text-sm text-gray-500">{lowStockItems.length} items need restocking</p>
                </div>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {lowStockItems.slice(0, 3).map((item) => (
                  <div key={item.item_id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{item.item_name}</span>
                    <span className="text-sm text-yellow-600">{item.current_stock} left</span>
                  </div>
                ))}
              </div>
              {lowStockItems.length > 3 && (
                <p className="text-xs text-gray-500 mt-2">+{lowStockItems.length - 3} more items</p>
              )}
            </div>
          )}

          {expiringItems.length > 0 && (
            <div className="card border-l-4 border-red-400">
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Expiring Soon</h3>
                  <p className="text-sm text-gray-500">{expiringItems.length} items expiring in 30 days</p>
                </div>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {expiringItems.slice(0, 3).map((item) => (
                  <div key={item.item_id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{item.item_name}</span>
                    <span className="text-sm text-red-600">{item.days_to_expiry} days</span>
                  </div>
                ))}
              </div>
              {expiringItems.length > 3 && (
                <p className="text-xs text-gray-500 mt-2">+{expiringItems.length - 3} more items</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Inventory Items</h2>
            <p className="text-sm text-gray-500 mt-1">{items.length} total items</p>
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
            <button className="btn-secondary flex items-center gap-2">
              <ArrowPathIcon className="w-4 h-4" />
              Record Transaction
            </button>
            <button className="btn-primary flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items..."
              className="input-field w-full pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="input-field"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="reagent">Reagents</option>
            <option value="consumable">Consumables</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
          <select
            className="input-field"
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value === 'true' })}
          >
            <option value="true">Active Items</option>
            <option value="false">Inactive Items</option>
            <option value="">All Items</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Min Level</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">No items found</td>
                </tr>
              ) : (
                items.map((item) => {
                  const stockStatus = getStockStatus(item.current_stock, item.min_stock_level);
                  return (
                    <tr key={item.item_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.item_name}</p>
                          <p className="text-xs text-gray-500">{item.item_code}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">{item.current_stock} {item.unit}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {item.min_stock_level} {item.unit}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        ₹{(item.unit_price || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${stockStatus.bgColor} ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
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

export default InventoryList;