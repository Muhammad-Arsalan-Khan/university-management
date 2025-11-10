import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const Staff = () => {
  const token = Cookies.get('token')
  const other = Cookies.get('other')

  return !token ? <Navigate to="/" /> : !other  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default Staff
