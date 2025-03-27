import Layout from './Layout';
import Dashboard from './components/Dashboard';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import Userprofile from './components/user_management/Userprofile';
import Login from './components/auth/Login';
import Protectedroute from './components/auth/Protectedroute';
import Publicroute from './components/auth/Publicroute';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Publicroute />}>
        <Route path="/auth/login" element={<Login />} />
      </Route>
      <Route element={<Protectedroute />}>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="/user-profiles" element={<Userprofile />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

export default Router;
