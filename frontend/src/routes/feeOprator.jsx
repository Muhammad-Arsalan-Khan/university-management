import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const  feeOprator = () => {
  const token = Cookies.get('token')
  const feeOprator = Cookies.get('Teacher')

  return !token ? <Navigate to="/" /> : !feeOprator  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default feeOprator