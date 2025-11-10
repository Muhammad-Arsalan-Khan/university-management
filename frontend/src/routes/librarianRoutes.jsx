import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const Librarian = () => {
  const token = Cookies.get('token')
  const Librarian = Cookies.get('Librarian')

  return !token ? <Navigate to="/" /> : !Librarian  ? <Navigate to="/dashboard" /> : <Outlet />
};

export default Librarian