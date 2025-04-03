import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Publicroute: React.FC = () => {
  // Check token in both localStorage and sessionStorage
  const token = localStorage.getItem('zendo_at') || sessionStorage.getItem('zendo_at');

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default Publicroute;
