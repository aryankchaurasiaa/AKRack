import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { DemoDashboard } from '../pages/DemoDashboard'; 
import { Products } from '../pages/Products';
import { LowStock } from '../pages/LowStock';
import { RecentUpdates } from '../pages/RecentUpdates';
import { Employees } from '../pages/Employees';
import { Settings } from '../pages/Settings';
import { About } from '../pages/About'; 
import { Billing } from '../pages/Billing'; 
import { Bills } from '../pages/Bills';
import { CustomerBill } from '../pages/CustomerBill'; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Agar user ka role allowed nahi hai, toh check karo ki wo Demo hai ya real user
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Demo user ko demo-dashboard par bhejo, baaki sabko real dashboard (/) par
    return <Navigate to={user.role === 'Demo' ? '/demo-dashboard' : '/'} replace />;
  }
  
  return children;
};

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Agar user pehle se login hai, toh uske role ke hisaab se use sahi dashboard par bhejo */}
      <Route path="/login" element={
        user ? (
          <Navigate to={user.role === 'Demo' ? '/demo-dashboard' : '/'} replace />
        ) : (
          <Login />
        )
      } />
      
      {/* Ye Customer ka Portal hai, ID ke sath match karega (Bina login ke khulega) */}
      <Route path="/bill/:id" element={<CustomerBill />} />

      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        
        {/* Real Dashboard sirf Admin, Employee, aur Super Admin ke liye */}
        <Route index element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Admin', 'Employee']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Naya Demo Dashboard sirf Demo users ke liye */}
        <Route path="demo-dashboard" element={
          <ProtectedRoute allowedRoles={['Demo']}>
            <DemoDashboard />
          </ProtectedRoute>
        } />
        
        {/* Billing aur Bills History ke Routes */}
        <Route path="billing" element={<ProtectedRoute allowedRoles={['Admin', 'Employee']}><Billing /></ProtectedRoute>} />
        <Route path="bills" element={<ProtectedRoute allowedRoles={['Admin', 'Employee']}><Bills /></ProtectedRoute>} />
        
        {/* Products par Demo ko allowed kiya gaya hai taaki wo sirf dekh sake */}
        <Route path="products" element={<ProtectedRoute allowedRoles={['Admin', 'Employee', 'Demo']}><Products /></ProtectedRoute>} />
        
        <Route path="low-stock" element={<ProtectedRoute allowedRoles={['Admin', 'Employee']}><LowStock /></ProtectedRoute>} />
        <Route path="recent-updates" element={<ProtectedRoute allowedRoles={['Admin', 'Employee']}><RecentUpdates /></ProtectedRoute>} />
        
        <Route path="employees" element={<ProtectedRoute allowedRoles={['Super Admin', 'Admin']}><Employees /></ProtectedRoute>} />
        
        {/* Settings ko Demo user se chhupa diya gaya hai */}
        <Route path="settings" element={<ProtectedRoute allowedRoles={['Super Admin', 'Admin', 'Employee']}><Settings /></ProtectedRoute>} />
        <Route path="about" element={<About />} /> 
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};