import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import Login from './views/Login.jsx';
import StudentDashboard from './views/StudentDashboard.jsx';
import CreatorDashboard from './views/CreatorDashboard.jsx';
import AdminDashboard from './views/AdminDashboard.jsx';
import CourseEditor from './views/CourseEditor.jsx';
import TestTaking from './views/TestTaking.jsx';

// Helper function to check role equivalence
const isRoleAllowed = (userRole, allowedRole) => {
  if (!userRole) return false;
  const role = userRole.toLowerCase();
  
  if (allowedRole === 'student') {
    return role === 'student' || role === 'learner' || role === 'employee';
  }
  if (allowedRole === 'creator') {
    return role === 'creator' || role === 'admin' || role === 'teacher';
  }
  if (allowedRole === 'admin') {
    return role === 'admin';
  }
  return role === allowedRole;
};

// Route Guard for authenticated users
const RequireAuth = ({ children, allowedRole }) => {
  const { user } = useApp();

  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && !isRoleAllowed(user.role, allowedRole)) {
    // Redirect to correct dashboard based on actual user role
    const isCreator = isRoleAllowed(user.role, 'creator');
    return isCreator 
      ? <Navigate to="/creator" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Route Guard for guests/unauthenticated users
const RequireGuest = ({ children }) => {
  const { user } = useApp();

  if (user) {
    const isAdmin = isRoleAllowed(user.role, 'admin');
    const isCreator = isRoleAllowed(user.role, 'creator');
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    if (isCreator) {
      return <Navigate to="/creator" replace />;
    }
    return <Navigate to="/dashboard" replace />;
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

        {/* Authenticated Student/Learner Routes */}
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

        {/* Authenticated Course Creator/Admin Routes */}
        <Route 
          path="/creator" 
          element={
            <RequireAuth allowedRole="creator">
              <CreatorDashboard />
            </RequireAuth>
          } 
        />
        <Route 
          path="/creator/course/:courseId?" 
          element={
            <RequireAuth allowedRole="creator">
              <CourseEditor />
            </RequireAuth>
          }
        />
        <Route 
          path="/admin" 
          element={
            <RequireAuth allowedRole="admin">
              <AdminDashboard />
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