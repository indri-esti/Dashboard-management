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
  MdOutlineCampaign,
  MdOutlineSchool,
  MdOutlineCardGiftcard,
  MdOutlineArticle,
  MdOutlineEvent,
  MdOutlineImage,
  MdOutlineStorage,
  MdOutlinePeople,
} from "react-icons/md";

import logo from "../assets/logo.png";

import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  
  const [openMaster, setOpenMaster] = useState(true);

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
  gap: 12,
  padding: "13px 16px",
  borderRadius: 14,
  marginBottom: 8,
  color: "#fff",
  background: active
  ? "rgba(255,255,255,.15)"
  : "transparent",

boxShadow: active
  ? "0 8px 20px rgba(0,0,0,.15)"
  : "none",
  fontWeight: active ? "700" : "500",
  transition: ".25s",
  textDecoration: "none",
});

  const submenuStyle = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 12px",
  borderRadius: 10,
  marginBottom: 5,
  color: "#E6EAFD",
  background: active ? "rgba(255,255,255,.10)" : "transparent",
  textDecoration: "none",
  fontSize: 14,
  transition: ".25s",
});

  return (
    <div
      style={{
        width: "clamp(250px,20vw,290px)",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #2F49C8 0%, #243BB8 100%)",
        boxShadow: "6px 0 20px rgba(0,0,0,0.15)",
        borderRight: "1px solid rgba(255,255,255,.08)",
        display: "flex",
        flexDirection: "column",
        padding:"24px 18px",
        color: "#fff",
      }}
    >
     <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 35,
    paddingLeft: 5,
  }}
>
  <img
    src={logo}
    alt="logo"
    style={{
      width: 48,
      height: 48,
      objectFit: "contain",
      background: "transparent",
      border: "none",
    }}
  />

  <h3
    style={{
      margin: 0,
      color: "#fff",
      fontWeight: "800",
      letterSpacing: ".5px",
      fontSize:"clamp(20px,2vw,26px)"
    }}
  >
    DASHBOARD
  </h3>
</div>

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
        
        {/* Leads Management */}
  <Nav.Link
    as={Link}
    to="/leads-management"
    style={menuStyle(location.pathname === "/leads-management")}
  >
    <MdOutlinePeople size={20} />
    <span>Leads Management</span>
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
        
          {/* Master Data */}
        <div style={{ marginTop: 8 }}>
  <div
    onClick={() => setOpenMaster(!openMaster)}
    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      padding: "12px 14px",
      borderRadius: 10,
      color: "#fff",
    }}
  >
    {openMaster ? (
      <MdKeyboardArrowDown size={18} />
    ) : (
      <MdKeyboardArrowRight size={18} />
    )}

    <MdOutlineStorage
      size={20}
      style={{
        marginLeft: 8,
        marginRight: 10,
      }}
    />

    <span>Master Data</span>
  </div>

  {openMaster && (
    <div style={{ marginLeft: 30 }}>
      <Nav.Link as={Link} to="/banner" style={submenuStyle(location.pathname === "/banner")}>
        <MdOutlineImage size={18} />
        Main Banner
      </Nav.Link>

      <Nav.Link as={Link} to="/kelas" style={submenuStyle(location.pathname === "/kelas")}>
        <MdOutlineSchool size={18} />
        Kelas
      </Nav.Link>

      <Nav.Link as={Link} to="/event" style={submenuStyle(location.pathname === "/event")}>
        <MdOutlineEvent size={18} />
        Event
      </Nav.Link>

      <Nav.Link as={Link} to="/voucher" style={submenuStyle(location.pathname === "/voucher")}>
        <MdOutlineCardGiftcard size={18} />
        Voucher
      </Nav.Link>

      <Nav.Link as={Link} to="/blog" style={submenuStyle(location.pathname === "/blog")}>
        <MdOutlineArticle size={18} />
        Blog
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