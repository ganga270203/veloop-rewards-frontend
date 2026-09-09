import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Scores from "./pages/Scores";

import GamesCarousel from "./components/games/GamesCarousel";
import GamePage from "./games/GamePage";


/* =========================
   PROTECTED ROUTE
========================= */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


/* =========================
   PUBLIC ROUTE
========================= */

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


/* =========================
   APP
========================= */

export default function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />


      {/* REGISTER */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />


      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* GAMES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <GamesCarousel />
          </ProtectedRoute>
        }
      />


      {/* INDIVIDUAL GAME */}
      <Route
        path="/games/:slug"
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        }
      />


      {/* SCORES */}
      <Route
        path="/scores"
        element={
          <ProtectedRoute>
            <Scores />
          </ProtectedRoute>
        }
      />


      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}