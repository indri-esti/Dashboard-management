import { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";

import {
  MdOutlineHome,
  MdOutlineGroups,
  MdOutlineMenuBook,
  MdOutlineAssignment,
  MdOutlineDashboardCustomize,
  MdOutlineWorkspacePremium,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdLogout,
} from "react-icons/md";

import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    nama: "Admin LMS",
    inisial: "A",
    foto: "",
  });

  useEffect(() => {
    const loadUser = () => {
      const data = JSON.parse(localStorage.getItem("profileData"));

      if (data) {
        const nama = data.nama || "Admin LMS";

        setUser({
          nama,
          inisial: nama.charAt(0).toUpperCase(),
          foto: data.foto || "",
        });
      }
    };

    loadUser();

    window.addEventListener("focus", loadUser);

    return () => {
      window.removeEventListener("focus", loadUser);
    };
  }, []);

  const [openKelas, setOpenKelas] = useState(true);

  const logout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#243bb8",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");

        Swal.fire({
          icon: "success",
          title: "Berhasil Logout",
          showConfirmButton: false,
          timer: 1200,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    });
  };

  const menuStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    marginBottom: "6px",
    color: "#fff",
    background: active ? "rgba(255,255,255,.12)" : "transparent",
    fontWeight: active ? "600" : "500",
    textDecoration: "none",
  });

  const submenuStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "4px",
    color: "#fff",
    background: active ? "rgba(255,255,255,.12)" : "transparent",
    textDecoration: "none",
    fontSize: 14,
  });

  return (
    <div
      style={{
        width: 260,
        minHeight: "100vh",
        background: "#243bb8",
        display: "flex",
        flexDirection: "column",
        padding: "22px 18px",
        color: "#fff",
      }}
    >
      <h4
        style={{
          textAlign: "center",
          fontWeight: "700",
          marginBottom: "25px",
        }}
      >
        DASHBOARD
      </h4>

      <Nav className="flex-column">
        {/* Beranda */}
        <Nav.Link
          as={Link}
          to="/"
          style={menuStyle(location.pathname === "/")}
        >
          <MdOutlineHome size={18} />
          <span>Beranda</span>
        </Nav.Link>

        {/* User */}
        <Nav.Link
          as={Link}
          to="/user-management"
          style={menuStyle(location.pathname === "/user-management")}
        >
          <MdOutlineGroups size={18} />
          <span>User Management</span>
        </Nav.Link>

        {/* Dropdown */}
        <div>
          <div
            onClick={() => setOpenKelas(!openKelas)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "10px 14px",
              borderRadius: 10,
              color: "#fff",
            }}
          >
            {openKelas ? (
              <MdKeyboardArrowDown size={16} />
            ) : (
              <MdKeyboardArrowRight size={16} />
            )}

            <MdOutlineMenuBook
              size={18}
              style={{
                marginLeft: 8,
                marginRight: 10,
              }}
            />

            <span>Kelas LMS</span>
          </div>

          {openKelas && (
            <div
              style={{
                marginLeft: 28,
                marginTop: 5,
              }}
            >
              <Nav.Link
                as={Link}
                to="/presensi"
                style={submenuStyle(location.pathname === "/presensi")}
              >
                <MdOutlineAssignment size={18} />
                Presensi Peserta
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/nilai"
                style={submenuStyle(location.pathname === "/nilai")}
              >
                <MdOutlineDashboardCustomize size={18} />
                Input Nilai
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/sertifikat"
                style={submenuStyle(location.pathname === "/sertifikat")}
              >
                <MdOutlineWorkspacePremium size={18} />
                Sertifikat
              </Nav.Link>
            </div>
          )}
        </div>
      </Nav>

      <div style={{ marginTop: "auto" }}>
        <button
          onClick={logout}
          style={{
            width: "100%",
            height: 40,
            background: "#fff",
            border: "none",
            borderRadius: 10,
            color: "#555",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <MdLogout size={18} />
          Keluar
        </button>

        <div style={{ marginTop: 15 }}>
          <Dropdown drop="up">
            <Dropdown.Toggle
              variant="link"
              id="dropdown-profile"
              style={{
                border: "none",
                background: "transparent",
                boxShadow: "none",
                padding: 0,
                width: "100%",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {user.foto ? (
                      <img
                        src={user.foto}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>{user.inisial}</span>
                    )}
                  </div>

                  <span
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {user.nama}
                  </span>
                </div>

                <MdKeyboardArrowDown size={16} color="#fff" />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>{user.nama}</Dropdown.Header>

              <Dropdown.Divider />

              <Dropdown.Item onClick={() => navigate("/profile")}>
                Profile
              </Dropdown.Item>

              <Dropdown.Item onClick={() => navigate("/settings")}>
                Settings
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;