import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const SDEO = () => {
  const token = Cookies.get('token')
  const SeniorDataEntryOperator = Cookies.get('SeniorDataEntryOperator')

  return !token ? <Navigate to="/" /> : !SeniorDataEntryOperator  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default SDEO
