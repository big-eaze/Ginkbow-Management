
import { Routes, Route} from 'react-router-dom';
import React from 'react';




import Academics from './pages/AdminAcademics/Academics.jsx';
import ExamSchedule from './pages/AdminAcademics/ExamSchedule.jsx';
import UploadResult from './pages/AdminAcademics/UploadResult.jsx';
import ViewResults from './pages/AdminAcademics/ViewResults.jsx';
import { MenuContext } from './Utils/MenuContext.jsx';
import Login from './signIn/Login.jsx';

import Dashboard from './pages/Dashboard.jsx';
import StudentsAdmin from './pages/StudentsAdmin.jsx';
import Staffs from './pages/Staffs.jsx';
import Announcement from './pages/Announcement.jsx';
import StudentDashboard from './pagesStudent/StudentDashboard.jsx';
import StudentAnnouncements from './pagesStudent/StudentAnnouncements.jsx';
import StudentAssignments from './pagesStudent/StudentAssignments.jsx';
import StudentExams from './pagesStudent/StudentExams.jsx';
import StudentResults from './pagesStudent/StudentResults.jsx';
import AdminChangePassword from './pages/AdminChangePassword.jsx';
import StudentChangePassword from './pagesStudent/StudentChangePassword.jsx';
import StaffDashboard from "./pagesStaff/StaffDashboard";
import StaffAnnouncement from './pagesStaff/StaffAnnoucement.jsx';
import StudentsAttendanceFF from './pagesStaff/StudentsAttendanceFF.jsx';
import StaffCourseWork from './pagesStaff/StaffCourseWork.jsx';
import StaffAttendance from './pagesStaff/StaffAttendance.jsx';
import NotFound from './NotFound.jsx';
import StaffChangePassword from './pagesStaff/StaffChangePassword.jsx';
import StaffAttendanceADM from './pages/StaffAttendanceADM.jsx';
import RegisterationPage from './RegistrationPage.jsx';
import ForgetPassword from './ForgetPassword.jsx';



function App() {

  return (
    <Routes>
      {/*Authentication route */}
      <Route index exact element={<Login />} />
      <Route path="/registration" element={<RegisterationPage />} />
      <Route path="/forget-password" element={<ForgetPassword />} />


      {/* Admin Routes */}
      <Route path="/ad-students" element={<StudentsAdmin />} />
      <Route path="/ad-staffs" element={<Staffs />} />
      <Route path="/ad-academics" element={<Academics />} />
      <Route path="/ad-dashboard" element={<Dashboard />} />
      <Route path="/ad-announcement" element={<Announcement />} />
      <Route path="/ad-change-password" element={<AdminChangePassword />} />
      <Route path="/ad-academics/exam-schedule" element={<ExamSchedule />} />
      <Route path="/ad-academics/upload-result" element={<UploadResult />} />
      <Route path="/ad-academics/view-results" element={<ViewResults />} />
      <Route path="/ad-ff-attendance" element={<StaffAttendanceADM />} />


      {/*Student Routes */}
      <Route path="/st-dashboard" element={<StudentDashboard />} />
      <Route path="/st-announcement" element={<StudentAnnouncements />} />
      <Route path='/st-assignments' element={<StudentAssignments />} />
      <Route path='/st-exams' element={<StudentExams />} />
      <Route path="/st-change-password" element={<StudentChangePassword />} />
      <Route path="/st-results" element={<StudentResults />} />


      {/*Staff Routes */}
      <Route path="/ff-dashboard" element={<StaffDashboard />} />
      <Route path="/ff-announcement" element={<StaffAnnouncement />} />
      <Route path='/ff-studentAttendance' element={<StudentsAttendanceFF />} />
      <Route path='/ff-courseWork' element={<StaffCourseWork />} />
      <Route path='/ff-myAttendance' element={<StaffAttendance />} />
      <Route path='/ff-change-password' element={<StaffChangePassword />} />


      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App
