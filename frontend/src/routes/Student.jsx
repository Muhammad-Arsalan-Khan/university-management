import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const  Student = () => {
  const token = Cookies.get('token')
  const Student = Cookies.get('Student')

  return !token ? <Navigate to="/" /> : !Student  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default Student