import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import DashboardNew from './pages/DashboardNew';
import InvoiceList from './pages/billing/InvoiceList';
import EMIManagement from './pages/billing/EMIManagement';
import PartyLedger from './pages/ledger/PartyLedger';
import InventoryList from './pages/inventory/InventoryList';
import DoctorList from './pages/doctors/DoctorList';
import PackageList from './pages/packages/PackageList';
import ReportsList from './pages/reports/ReportsList';
import Settings from './pages/settings/Settings';
import './styles/globals.css';

// Import new modern pages
import PatientList from './pages/patients/PatientList';
import TestList from './pages/tests/TestList';
import ItemList from './pages/items/ItemList';

function App() {
  // Setup global axios interceptor for 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log('401 Unauthorized - Redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
  // Check if user is logged in
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* New Modern UI Pages */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardNew />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/billing" 
          element={
            <ProtectedRoute>
              <InvoiceList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/emi" 
          element={
            <ProtectedRoute>
              <EMIManagement />
            </ProtectedRoute>
          } 
        />

        {/* Modern UI Pages */}
        <Route 
          path="/patients" 
          element={
            <ProtectedRoute>
              <PatientList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tests" 
          element={
            <ProtectedRoute>
              <TestList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/items" 
          element={
            <ProtectedRoute>
              <ItemList />
            </ProtectedRoute>
          } 
        />

        {/* New Modern UI Pages */}
        <Route 
          path="/ledger" 
          element={
            <ProtectedRoute>
              <PartyLedger />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute>
              <InventoryList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/doctors" 
          element={
            <ProtectedRoute>
              <DoctorList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/packages" 
          element={
            <ProtectedRoute>
              <PackageList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <ReportsList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
