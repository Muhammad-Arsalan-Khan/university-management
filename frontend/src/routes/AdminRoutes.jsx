import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const AdminRoute = () => {
  const token = Cookies.get('token')
  const HOD = Cookies.get('HOD')

  return !token ? <Navigate to="/" /> : !HOD  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default AdminRoute
