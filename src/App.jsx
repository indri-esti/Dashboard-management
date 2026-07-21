import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route
          path="/user-management"
          element={<UserManagement />}
        />

        {/* Sementara dashboard diarahkan ke User Management */}
        <Route
          path="/dashboard"
          element={<Navigate to="/user-management" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;