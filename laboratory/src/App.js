import React, { useEffect } from 'react';

import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

// All pages
// import Home from './pages/Home';



// import Page404 from './pages/Page404';
import Login from './pages/Login';
import NewTestCreationPage from './pages/NewTestCreationPage';
import TestListPage from './pages/TestListPage';
import PatientEntryPage from './pages/PatientEntryPage';
import ReportEntryPage from './pages/ReportEntryPage';
import ReportShowCasePage from './pages/ReportShowCasePage';
import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
import TrackingPage from './pages/TrackingPage';
import Dashboard from './pages/Dashboard';
import PatientListPage from './pages/PatientListPage';
import ProfilePage from './pages/ProfilePage';
import PatientTestsListPage from './pages/PatientTestsListPage';
import PatientBillPage from './pages/PatientBillPage';
import NewItemCreationPage from './pages/NewItemCreationPage';
import ItemListPage from './pages/ItemListPage';
import Page404 from './pages/Page404';
import PrivateRoute from './PrivateRoute';

function App() {


  return (
    <>
      <Router>
        <AuthProvider>
          <SidebarProvider>

          <Routes>
            {/* <Route path="/" element={<Home />} /> */}


            {/* Products Route  */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={ <PrivateRoute> <Dashboard /></PrivateRoute>} />

            <Route path="/create-test" element={<PrivateRoute><NewTestCreationPage /></PrivateRoute> } />
            <Route path="/test-lists" element={<PrivateRoute><TestListPage /></PrivateRoute>} />
            <Route path="/create-item" element={<PrivateRoute><NewItemCreationPage /></PrivateRoute>} />
            <Route path="/Item-lists" element={<PrivateRoute><ItemListPage /></PrivateRoute>} />

            <Route path="/patient-entry" element={<PrivateRoute><PatientEntryPage /></PrivateRoute>} />
            <Route path="/patient-list" element={<PrivateRoute><PatientListPage /></PrivateRoute>} />
            <Route path="/patient-tests-list" element={<PrivateRoute><PatientTestsListPage /></PrivateRoute>} />
            
            <Route path="/report-entry" element={<PrivateRoute><ReportEntryPage /></PrivateRoute>} />
            <Route path="/reports-status" element={<PrivateRoute><TrackingPage /></PrivateRoute>} />

            <Route path="/patient-invoice/:sales_id" element={<PrivateRoute><PatientBillPage /></PrivateRoute>} />

            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
             

      
            <Route path="/report-showcase" element={<PrivateRoute><ReportShowCasePage /></PrivateRoute>} />

            <Route path="*" element={<Page404 />} />
      
            {/* Industries */}

            {/* <Route path="*" element={<Page404 />} />  */}

          </Routes>

          </SidebarProvider>
        </AuthProvider>
      </Router>
    </>
  );
}


export default App;
