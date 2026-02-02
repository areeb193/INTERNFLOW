import './App.css'
import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobst'
import Browse from './components/Browse'
import Profile from './components/Profile'
import Companies from './components/admin/Companies'
import JobDescription from './components/JobDescription'
import JobHunt from './components/JobHunt'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import Adminjobs from './components/admin/Adminjobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },  
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/jobs',
    element: <ProtectedRoute><Jobs/></ProtectedRoute>
  },
  {
    path: '/browse',
    element: <ProtectedRoute><Browse/></ProtectedRoute>
  },
  {
    path: "/description/:id",
    element: <ProtectedRoute><JobDescription/></ProtectedRoute>
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile/></ProtectedRoute>
  },
  {
    path: '/job-hunt',
    element: <ProtectedRoute><JobHunt/></ProtectedRoute>
  },
  //admin recruiter kay liya routes
  {
    path: "/admin/companies",
    element: <Companies/>
  },
  {
    path: "/admin/companies/create",
    element: <CompanyCreate/>
  },
  {
    path: "/admin/companies/:id",
    element: <CompanySetup/>
  },
  {
    path: "/admin/jobs",
    element: <Adminjobs/>
  },
  {
    path: "/admin/jobs/create",
    element: <PostJob/>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <Applicants/>
  }

])

function App() {

  return (
    <div>
    <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
