import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const JDEO = () => {
  const token = Cookies.get('token')
  const JuniorDataEntryOperator = Cookies.get('JuniorDataEntryOperator')

  return !token ? <Navigate to="/" /> : !JuniorDataEntryOperator  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default JDEO