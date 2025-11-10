import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const  LabIncharge = () => {
  const token = Cookies.get('token')
  const LabIncharge = Cookies.get('LabIncharge')

  return !token ? <Navigate to="/" /> : !LabIncharge  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default LabIncharge