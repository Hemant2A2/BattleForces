import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import SubmitHandle from './pages/SubmitHandle'
import ProblemPage from './pages/ProblemPage'
import CreatePassword from './pages/CreatePassword'
import NotFound from './pages/NotFound'
import Home from './pages/Home'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/submit-handle" element={<SubmitHandle />} />
        <Route path="/problem-page" element={<ProblemPage />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
