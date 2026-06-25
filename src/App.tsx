import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { QueryProvider } from './providers/QueryProvider'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import StudentList from './pages/StudentList'
import AddStudent from './pages/AddStudent'
import EditStudent from './pages/EditStudent'
import StudentDetails from './pages/StudentDetails'
import TeacherList from './pages/TeacherList'
import AddTeacher from './pages/AddTeacher'
import EditTeacher from './pages/EditTeacher'
import TeacherProfile from './pages/TeacherProfile'
import ClassList from './pages/ClassList'
import AddClass from './pages/AddClass'
import EditClass from './pages/EditClass'
import ClassDetails from './pages/ClassDetails'
import SubjectList from './pages/SubjectList'
import AddSubject from './pages/AddSubject'
import EditSubject from './pages/EditSubject'
import SubjectDetails from './pages/SubjectDetails'
import AttendanceList from './pages/AttendanceList'
import MarkAttendance from './pages/MarkAttendance'
import AttendanceDetails from './pages/AttendanceDetails'
import EditAttendance from './pages/EditAttendance'
import Settings from './pages/Settings'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="students" element={<StudentList />} />
                  <Route path="students/add" element={<AddStudent />} />
                  <Route path="students/:id" element={<StudentDetails />} />
                  <Route path="students/:id/edit" element={<EditStudent />} />
                  <Route path="teachers" element={<TeacherList />} />
                  <Route path="teachers/add" element={<AddTeacher />} />
                  <Route path="teachers/:id" element={<TeacherProfile />} />
                  <Route path="teachers/:id/edit" element={<EditTeacher />} />
                  <Route path="classes" element={<ClassList />} />
                  <Route path="classes/add" element={<AddClass />} />
                  <Route path="classes/:id" element={<ClassDetails />} />
                  <Route path="classes/:id/edit" element={<EditClass />} />
                  <Route path="subjects" element={<SubjectList />} />
                  <Route path="subjects/add" element={<AddSubject />} />
                  <Route path="subjects/:id" element={<SubjectDetails />} />
                  <Route path="subjects/:id/edit" element={<EditSubject />} />
                  <Route path="attendance" element={<AttendanceList />} />
                  <Route path="attendance/mark" element={<MarkAttendance />} />
                  <Route path="attendance/:id" element={<AttendanceDetails />} />
                  <Route path="attendance/:id/edit" element={<EditAttendance />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
      <Toaster position="top-right" richColors closeButton />
    </Provider>
  )
}

export default App
