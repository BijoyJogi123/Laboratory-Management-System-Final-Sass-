import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  BeakerIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  
  // Check if user is on any reports page and auto-open dropdown
  const isOnReportsPage = () => {
    return ['/lab/results', '/doctor/verify', '/reports', '/reports/view'].some(path => 
      location.pathname.startsWith(path)
    );
  };
  
  const [reportsOpen, setReportsOpen] = useState(isOnReportsPage());

  // Auto-open reports dropdown when navigating to reports pages
  useEffect(() => {
    if (isOnReportsPage()) {
      setReportsOpen(true);
    }
  }, [location.pathname]);

  // Menu items before Reports dropdown
  const menuItemsBeforeReports = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Billing', path: '/billing', icon: CreditCardIcon },
    { name: 'EMI', path: '/emi', icon: DocumentTextIcon },
    { name: 'Ledger', path: '/ledger', icon: ChartBarIcon },
    { name: 'Patients', path: '/patients', icon: UserGroupIcon },
  ];

  // Menu items after Reports dropdown
  const menuItemsAfterReports = [
    { name: 'Tests', path: '/tests', icon: BeakerIcon },
    { name: 'Packages', path: '/packages', icon: CubeIcon },
    { name: 'Inventory', path: '/inventory', icon: ClipboardDocumentListIcon },
    { name: 'Doctors', path: '/doctors', icon: UserCircleIcon },
    { name: 'Orders', path: '/orders', icon: DocumentTextIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  const reportsSubmenu = [
    { name: 'Lab Results', path: '/lab/results', icon: ClipboardDocumentCheckIcon },
    { name: 'Doctor Verify', path: '/doctor/verify', icon: ShieldCheckIcon },
    { name: 'Generate Reports', path: '/reports', icon: DocumentChartBarIcon },
    { name: 'View Reports', path: '/reports/view', icon: EyeIcon },
  ];

  const isActive = (path) => location.pathname.startsWith(path);
  const isReportsActive = () => {
    return reportsSubmenu.some(item => location.pathname.startsWith(item.path));
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-purple-600">LabHub</h1>
        <p className="text-xs text-gray-500 mt-1">Laboratory Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {/* Menu items before Reports */}
          {menuItemsBeforeReports.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Reports Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={`sidebar-item w-full text-left ${isReportsActive() ? 'sidebar-item-active' : ''}`}
            >
              <DocumentChartBarIcon className="w-5 h-5" />
              <span>Reports</span>
              {reportsOpen ? (
                <ChevronDownIcon className="w-4 h-4 ml-auto" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 ml-auto" />
              )}
            </button>

            {/* Reports Submenu */}
            {reportsOpen && (
              <div className="ml-6 space-y-1">
                {reportsSubmenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`sidebar-item text-sm ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Menu items after Reports */}
          {menuItemsAfterReports.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Support Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-purple-50 rounded-2xl p-4">
          <p className="text-sm font-medium text-purple-900 mb-1">Need Help?</p>
          <p className="text-xs text-purple-600 mb-3">Contact support team</p>
          <button className="w-full bg-purple-600 text-white text-sm py-2 rounded-xl hover:bg-purple-700 transition-colors">
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
