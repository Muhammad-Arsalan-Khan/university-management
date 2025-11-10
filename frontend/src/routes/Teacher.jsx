import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const  Teacher = () => {
  const token = Cookies.get('token')
  const Teacher = Cookies.get('Teacher')

  return !token ? <Navigate to="/" /> : !Teacher  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default Teacher