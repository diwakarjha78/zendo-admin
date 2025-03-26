import Layout from './Layout';
import Dashboard from './components/Dashboard';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Userprofile from './components/user_management/Userprofile';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Dashboard />}/>
      <Route path="/user-profiles" element={<Userprofile />}/>

    </Route>
  )
);

export default Router;