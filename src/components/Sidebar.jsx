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
  
  const [openMaster, setOpenMaster] = useState(false);
  const [openKelas, setOpenKelas] = useState(false);


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
  gap: 14,

  padding: "13px 16px",

  marginBottom: 8,

  borderRadius: 14,

  color: active ? "#fff" : "#D9E1FF",

  background: active
    ? "rgba(255,255,255,.16)"
    : "transparent",

  fontWeight: active ? 700 : 500,

  transition: "all .25s ease",

  textDecoration: "none",

  border: active
    ? "1px solid rgba(255,255,255,.18)"
    : "1px solid transparent",

  boxShadow: active
    ? "0 12px 24px rgba(0,0,0,.18)"
    : "none",
});

 const submenuStyle = (active) => ({

display:"flex",

alignItems:"center",

gap:12,

padding:"10px 14px",

marginBottom:6,

borderRadius:12,

color:active?"#fff":"#D8DFFF",

background:active

?"rgba(255,255,255,.12)"

:"transparent",

fontSize:14,

transition:"all .25s",

textDecoration:"none",

});

  return (
    <div
      style={{
        width: "clamp(250px,20vw,290px)",
        minHeight: "100vh",
        background: "linear-gradient(180deg,#2539A8 0%,#1E2B7A 100%)",
        boxShadow: "10px 0 35px rgba(0,0,0,.18)",
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
    gap: 16,
    padding: "0 8px",
    marginBottom: 40,
    minHeight: 56,
  }}
>
  <img
    src={logo}
    alt="Logo"
    style={{
      width: 38,
      height: 38,
      objectFit: "contain",
      flexShrink: 0,
      display: "block",
    }}
  />

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <span
      style={{
        fontSize: 24,
        fontWeight: 800,
        color: "#fff",
        lineHeight: 1,
        letterSpacing: ".4px",
      }}
    >
      DASHBOARD
    </span>

    <span
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,.7)",
        letterSpacing: "2px",
        marginTop: 5,
      }}
    >
      MANAGEMENT SYSTEM
    </span>
  </div>
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
            marginBottom: 20,
            boxShadow: "0 8px 18px rgba(0,0,0,.12)",
            cursor: "pointer",
            transition: ".25s",
          }}
        >
          <MdLogout size={18} />
          Keluar
        </button>

        <div
  style={{
    background: "rgba(255,255,255,.08)",
    borderRadius: 14,
    padding: 12,
    border: "1px solid rgba(255,255,255,.08)",
  }}
>
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