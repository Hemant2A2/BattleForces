import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute'
import SubmitHandle from './pages/SubmitHandle'
import VerifyHandle from './pages/VerifyHandle'
import CreatePassword from './pages/CreatePassword'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Login from './pages/Login'
import UserProfile from './pages/UserProfile'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/submit-handle" element={<SubmitHandle />} />
        <Route path="/verify-handle" element={<VerifyHandle />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/userProfile/:username"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
