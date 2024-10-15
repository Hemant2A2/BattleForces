import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import SubmitHandle from './pages/SubmitHandle'
import VerifyHandle from './pages/VerifyHandle'
import CreatePassword from './pages/CreatePassword'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/submit-handle" element={<SubmitHandle />} />
        <Route path="/verify-handle" element={<VerifyHandle />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
