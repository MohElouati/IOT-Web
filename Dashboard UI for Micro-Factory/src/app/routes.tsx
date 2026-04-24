import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Control } from "./pages/Control";
import { Logs } from "./pages/Logs";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  // 🔁 Default → login
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // 🔐 Login (with auto redirect if already logged)
  {
    path: "/login",
    element: localStorage.getItem("token") ? (
      <Navigate to="/app" replace />
    ) : (
      <Login />
    ),
  },

  // 🔒 Protected app
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "control", element: <Control /> },
      { path: "logs", element: <Logs /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);