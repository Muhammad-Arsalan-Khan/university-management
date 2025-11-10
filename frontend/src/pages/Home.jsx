import { Routes, Route } from 'react-router-dom'
import AdminRoute from '../routes/AdminRoutes'
import SDEO from "../routes/seniordata"
import JDEO from "../routes/juniordata"
import LabIncharge from "../routes/labincharge"
import Librarian from "../routes/librarianRoutes"
import Teacher from "../routes/Teacher"
import Student from "../routes/Student"
// import feeOprator from "../routes/feeOprator"
import Staff from "../routes/staff"
import AuthRoutes from '../routes/authRoutes'
import PrivateRoutes from '../routes/privateRoutes'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import LandingPage from './LandingPage'
import Dashboard from './user/Dashboard'
import AdminDashboard from './admin/Dashboard'
import SDEODashboard from '.././components/content/SDEODashboard'
import JDEODashboard from '.././components/content/JDEODashboard'
import TeacherDashboard from '.././components/content/TeacherDashboard'
import StudentDashboard from '.././components/content/StudentDashboard'
import StaffDashboard from '.././components/content/StaffDashboard'
import LibrarianDashboard from '.././components/content/LibrarianDashboard'
import LabInchargeDashboard from '.././components/content/LabInchargeDashboard'
// import feeOpratorDashboard from './content/feeOpratorDashboard'
import NotFound from "./NotFound"

function Home() {
  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route index element={<LandingPage />} />
  
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard/:id" element={<Dashboard />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard/:id" element={<AdminDashboard/>} />
        </Route>

        <Route element={<SDEO />}>
          <Route path="SeniorDataEntryOperator/dashboard/:id" element={<SDEODashboard/>} />
        </Route>
        <Route element={<JDEO />}>
          <Route path="/JuniorDataEntryOperator/dashboard/:id" element={<JDEODashboard/>} />
        </Route>
        <Route element={<LabIncharge />}>
          <Route path="/LabIncharge/dashboard/:id" element={<LabInchargeDashboard/>} />
        </Route>
        <Route element={<Librarian />}>
          <Route path="/Librarian/dashboard/:id" element={<LibrarianDashboard/>} />
        </Route>
        <Route element={<Teacher />}>
          <Route path="/Teacher/dashboard/:id" element={<TeacherDashboard/>} />
        </Route>
        <Route element={<Student />}>
          <Route path="/Student/dashboard/:id" element={<StudentDashboard/>} />
        </Route>
        {/* <Route element={<feeOprator />}>
          <Route path="/feeOprator/dashboard/:id" element={<feeOpratorDashboard/>} />
        </Route> */}
        <Route element={<Staff />}>
          <Route path="/staff/dashboard/:id" element={<StaffDashboard/>} />
        </Route>



        <Route element={<AuthRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>{/* </Route> */}
      </Routes>
    </>
  )
}

export default Home