import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClaimList from './components/ClaimList';
import ClaimForm from './components/ClaimForm';
import Profile from './components/Profile';
import DisasterUpdates from './components/DisasterUpdates';
import Resources from './components/Resources';
import Settings from './components/Settings';
import Help from './components/Help';
import Notifications from './components/Notifications';

// PrivateRoute wrapper component
const PrivateRoute = ({ children }) => {
  const { authToken } = useContext(AuthContext);
  
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </>
  );
};

function App() {
  const { authToken } = useContext(AuthContext);

  return (
    <div className="app">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={authToken ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={authToken ? <Navigate to="/dashboard" replace /> : <Register />} 
        />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/claims" element={<PrivateRoute><ClaimList /></PrivateRoute>} />
        <Route path="/claim/new" element={<PrivateRoute><ClaimForm /></PrivateRoute>} />
        <Route path="/disaster-updates" element={<PrivateRoute><DisasterUpdates /></PrivateRoute>} />
        <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to={authToken ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={authToken ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

export default App;