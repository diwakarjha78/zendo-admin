import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Protectedroute: React.FC = () => {
  const token = localStorage.getItem('zendo_at');

  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default Protectedroute;
