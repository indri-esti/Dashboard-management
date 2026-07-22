import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import MainLayout from "./layouts/MainLayout";
import AddUser from "./pages/AddUser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      {/* Halaman yang memakai Sidebar */}
      <Route element={<MainLayout />}>
        <Route
          path="/user-management"
          element={<UserManagement />}
        />

        <Route
          path="/dashboard"
          element={<Navigate to="/user-management" replace />}
        />
      </Route>

      {/* Halaman TANPA Sidebar */}
      <Route
        path="/user-management/tambah"
        element={<AddUser />}
      />
    </Routes>
  );
}

export default App;