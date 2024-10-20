import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SubmitHandle from "./pages/SubmitHandle";
import VerifyHandle from "./pages/VerifyHandle";
import CreatePassword from "./pages/CreatePassword";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import CreateContest from "./pages/CreateContest";
import CommonNavbar from "./components/CommonNavbar";
import Participants from "./pages/Participants";
import Problems from "./pages/Problems";
import Standings from "./pages/Standings";
import JoinContest from "./pages/JoinContest";


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <CommonNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit-handle" element={<SubmitHandle />} />
        <Route path="/verify-handle" element={<VerifyHandle />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/userProfile/:username"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-contest"
          element={
            <ProtectedRoute>
              <CreateContest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contests/:contestId/participants"
          element={
            <ProtectedRoute>
              <Participants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contests/:contestId/problems"
          element={
            <ProtectedRoute>
              <Problems/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contests/:contestId/standings"
          element={
            <ProtectedRoute>
              <Standings />
            </ProtectedRoute>
          }
        />
         <Route
          path="/join-contest"
          element={
            <ProtectedRoute>
              <JoinContest />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
