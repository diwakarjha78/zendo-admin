import Layout from './Layout';
import Dashboard from './components/Dashboard';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import Userprofile from './components/user_management/Userprofile';
import Login from './components/auth/Login';
import Protectedroute from './components/auth/Protectedroute';
import Publicroute from './components/auth/Publicroute';
import Forgotpassword from './components/auth/Forgotpassword';
import Useractivity from './components/user_management/Useractivity';
import Customersupport from './components/Customersupport';
import Profile from './components/Profile';
import Contentmanagement from './components/content_management/Contentmanagement';
import Transactionmanagement from './components/security_and_payments/Transactionmanagement';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Publicroute />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<Forgotpassword />} />
        <Route path="/auth/verify-otp" element={<Forgotpassword />} />
        <Route path="/auth/forgot-password" element={<Forgotpassword />} />
      </Route>
      <Route element={<Protectedroute />}>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="/user-profiles" element={<Userprofile />} />
          <Route path="/user-activity" element={<Useractivity />} />
          <Route path="/customer-support" element={<Customersupport />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/content-management" element={<Contentmanagement />} />
          <Route path="/transaction-management" element={<Transactionmanagement />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

export default Router;
