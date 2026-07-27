import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import MainLayout from "./layouts/MainLayout";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";

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

      {/* Halaman Edit User */}
      <Route
        path="/user-management/edit/:id"
        element={<EditUser />}
      />

      {/* Halaman Profile */}
      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* Halaman Setting */}
      <Route
        path="/settings"
        element={<Setting />}
      />

    </Routes>
  );
}

export default App;