import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import Login from './views/Login.jsx';
import StudentDashboard from './views/StudentDashboard.jsx';
import CreatorDashboard from './views/CreatorDashboard.jsx';
import TestTaking from './views/TestTaking.jsx';

// Route Guard for authenticated users
const RequireAuth = ({ children, allowedRole }) => {
  const { user } = useApp();

  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to correct dashboard based on role
    return user.role === 'creator' 
      ? <Navigate to="/creator" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Route Guard for guests/unauthenticated users
const RequireGuest = ({ children }) => {
  const { user } = useApp();

  if (user) {
    return user.role === 'creator' 
      ? <Navigate to="/creator" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Guest Routes */}
        <Route 
          path="/login" 
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          } 
        />

        {/* Authenticated Student Routes */}
        <Route 
          path="/dashboard" 
          element={
            <RequireAuth allowedRole="student">
              <StudentDashboard />
            </RequireAuth>
          } 
        />
        
        <Route 
          path="/test/:testId" 
          element={
            <RequireAuth allowedRole="student">
              <TestTaking />
            </RequireAuth>
          } 
        />

        {/* Authenticated Course Creator Routes */}
        <Route 
          path="/creator" 
          element={
            <RequireAuth allowedRole="creator">
              <CreatorDashboard />
            </RequireAuth>
          } 
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
