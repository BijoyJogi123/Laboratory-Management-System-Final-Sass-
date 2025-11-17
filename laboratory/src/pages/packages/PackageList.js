import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    is_active: true
  });

  useEffect(() => {
    fetchPackages();
    fetchStats();
  }, [filters]);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/packages', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setPackages(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/packages/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateDiscount = (originalPrice, packagePrice) => {
    if (!originalPrice || !packagePrice) return 0;
    return Math.round(((originalPrice - packagePrice) / originalPrice) * 100);
  };

  return (
    <MainLayout title="Test Packages" subtitle="Manage test packages and bundles">
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Packages</p>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <BeakerIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_packages || 0}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.active_packages || 0} active</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Packages Sold</p>
              <TagIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.packages_sold || 0}</p>
            <p className="text-xs text-gray-500 mt-1">This month: {stats.monthly_sales || 0}</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Revenue</p>
              <CurrencyRupeeIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{(stats.total_revenue || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">From packages</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg. Discount</p>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-orange-600 text-xs font-bold">%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.avg_discount || 0}%</p>
            <p className="text-xs text-gray-500 mt-1">Average savings</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Available Packages</h2>
            <p className="text-sm text-gray-500 mt-1">{packages.length} packages available</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Create Package
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search packages..."
              className="input-field w-full pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="input-field"
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value === 'true' })}
          >
            <option value="true">Active Packages</option>
            <option value="false">Inactive Packages</option>
            <option value="">All Packages</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-gray-500">Loading packages...</div>
          ) : packages.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-500">No packages found</div>
          ) : (
            packages.map((pkg) => {
              const discount = calculateDiscount(pkg.original_price, pkg.package_price);
              return (
                <div key={pkg.package_id} className="card hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{pkg.package_name}</h3>
                      <p className="text-sm text-gray-500">{pkg.package_code}</p>
                    </div>
                    {discount > 0 && (
                      <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {pkg.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <BeakerIcon className="w-5 h-5 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Tests Included</p>
                        <p className="text-sm font-medium text-gray-900">{pkg.test_count || 0} tests</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">TAT</p>
                        <p className="text-sm font-medium text-gray-900">{pkg.tat_hours || 24} hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Package Price</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-purple-600">₹{(pkg.package_price || 0).toLocaleString()}</p>
                          {pkg.original_price && pkg.original_price > pkg.package_price && (
                            <p className="text-sm text-gray-400 line-through">₹{pkg.original_price.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      {pkg.is_active ? (
                        <span className="badge bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-700">Inactive</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn-secondary flex-1 text-sm">View Tests</button>
                    <button className="btn-primary flex-1 text-sm">Edit</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PackageList;