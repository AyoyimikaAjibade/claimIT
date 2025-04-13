import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClaimList from './components/ClaimList';
import ClaimForm from './components/ClaimForm';
import Profile from './components/Profile';
import DisasterUpdates from './components/DisasterUpdates';

function App() {
  const { authToken } = useContext(AuthContext);

  return (
    <div className="App">
      <Navbar />
      <div className="container-fluid">
        <Routes>
          <Route 
            path="/login" 
            element={authToken ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={authToken ? <Navigate to="/dashboard" replace /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={authToken ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/claims" 
            element={authToken ? <ClaimList /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/claim/new" 
            element={authToken ? <ClaimForm /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/profile" 
            element={authToken ? <Profile /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/disaster-updates" 
            element={authToken ? <DisasterUpdates /> : <Navigate to="/login" replace />} 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;