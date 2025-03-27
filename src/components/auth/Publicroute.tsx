import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Publicroute: React.FC = () => {
  const token = localStorage.getItem('zendo_at');

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default Publicroute;
