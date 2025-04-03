import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Protectedroute: React.FC = () => {
  // Check token in both localStorage and sessionStorage
  const token = localStorage.getItem('zendo_at') || sessionStorage.getItem('zendo_at');

  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default Protectedroute;
