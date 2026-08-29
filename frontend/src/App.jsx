import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import RegisterHR from "./pages/RegisterHR";
import RegisterCandidate from "./pages/RegisterCandidate";
import Login from "./pages/Login";

import HRDashboard from "./pages/HRDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateList from "./pages/CandidateList";

function App() {
  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-[#070b14] text-white">
            <Navbar />
            <Home />
            <Footer />
          </div>
        }
      />

      {/* HR Registration */}
      <Route
        path="/register/hr"
        element={<RegisterHR />}
      />

      {/* Candidate Registration */}
      <Route
        path="/register/candidate"
        element={<RegisterCandidate />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* HR Dashboard */}
      <Route
        path="/dashboard/hr"
        element={<HRDashboard />}
      />

      {/* Candidate Dashboard */}
      <Route
        path="/candidatelist"
        element={<CandidateList />}
      />

    </Routes>
  );
}

export default App;