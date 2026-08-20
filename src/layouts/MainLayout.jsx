import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",     // kunci tinggi ke viewport
        overflow: "hidden",  // cegah body ikut scroll
        background: "#F5F7FB",
      }}
    >
      {/* Sidebar (sticky-nya sudah diatur di dalam Sidebar.jsx) */}
      <Sidebar />

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Isi halaman */}
        <main
          style={{
            flex: 1,
            padding: "30px",
            overflowY: "auto", // ini yang jadi area scroll
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;