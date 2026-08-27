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
  MdPersonOutline,
  MdChevronRight,
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
      try {
        const profileData = JSON.parse(
          localStorage.getItem("profileData")
        );

        const loginUser = JSON.parse(
          localStorage.getItem("user")
        );

        // Prioritaskan profileData karena data profile
        // sudah diperbarui setelah edit profile
        const data = profileData || loginUser;

        if (data) {
          const nama = data.nama || "Admin LMS";

          setUser({
            nama,
            inisial: nama.charAt(0).toUpperCase(),
            foto: data.foto || "",
          });
        } else {
          setUser({
            nama: "Admin LMS",
            inisial: "A",
            foto: "",
          });
        }
      } catch (error) {
        console.error("Gagal membaca data user:", error);
      }
    };

    loadUser();

    window.addEventListener("focus", loadUser);

    // Supaya Sidebar langsung ikut berubah
    // ketika profileData berubah
    const handleStorage = (event) => {
      if (
        event.key === "profileData" ||
        event.key === "user"
      ) {
        loadUser();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "focus",
        loadUser
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
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
      customClass: {
        popup: "modern-swal-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("profileData");

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
    gap: 13,
    padding: "12px 14px",
    marginBottom: 6,
    borderRadius: 12,
    color: active
      ? "#ffffff"
      : "rgba(255,255,255,.72)",
    background: active
      ? "linear-gradient(135deg, rgba(255,255,255,.20), rgba(255,255,255,.10))"
      : "transparent",
    fontWeight: active ? 650 : 500,
    fontSize: 14,
    transition: "all .22s ease",
    textDecoration: "none",
    border: active
      ? "1px solid rgba(255,255,255,.14)"
      : "1px solid transparent",
    boxShadow: active
      ? "0 8px 20px rgba(0,0,0,.12)"
      : "none",
  });

  const submenuStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "9px 12px",
    marginBottom: 4,
    borderRadius: 10,
    color: active
      ? "#ffffff"
      : "rgba(255,255,255,.66)",
    background: active
      ? "rgba(255,255,255,.13)"
      : "transparent",
    fontSize: 13.5,
    fontWeight: active ? 600 : 450,
    transition: "all .22s ease",
    textDecoration: "none",
  });

  // Style khusus untuk item yang non-active (belum bisa dinavigasi)
  const submenuDisabledStyle = {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "9px 12px",
    marginBottom: 4,
    borderRadius: 10,
    color: "rgba(255,255,255,.35)",
    background: "transparent",
    fontSize: 13.5,
    fontWeight: 450,
    transition: "all .22s ease",
    textDecoration: "none",
    cursor: "not-allowed",
    opacity: 0.6,
  };

  const dropdownTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: 11,
    cursor: "pointer",
    padding: "12px 14px",
    borderRadius: 12,
    color: "rgba(255,255,255,.78)",
    fontSize: 14,
    fontWeight: 500,
    transition: "all .22s ease",
  };

  return (
    <div
      style={{
        width: "clamp(250px, 20vw, 290px)",
        height: "100vh",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        background:
          "linear-gradient(180deg, #2539A8 0%, #202F91 48%, #1B286E 100%)",
        boxShadow:
          "12px 0 40px rgba(15, 23, 42, .16)",
        borderRight:
          "1px solid rgba(255,255,255,.08)",
        display: "flex",
        flexDirection: "column",
        padding: "22px 16px",
        color: "#fff",
        overflow: "hidden",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Decorative background */}
      <div
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,.035)",
          top: -80,
          right: -70,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(255,255,255,.025)",
          bottom: 80,
          left: -150,
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          padding: "5px 8px",
          marginBottom: 34,
          minHeight: 58,
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: "rgba(255,255,255,.12)",
            border:
              "1px solid rgba(255,255,255,.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow:
              "0 8px 20px rgba(0,0,0,.10)",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 32,
              height: 32,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: ".5px",
            }}
          >
            DASHBOARD
          </span>

          <span
            style={{
              fontSize: 8.5,
              color:
                "rgba(255,255,255,.60)",
              letterSpacing: "1.6px",
              marginTop: 5,
              whiteSpace: "nowrap",
            }}
          >
            MANAGEMENT SYSTEM
          </span>
        </div>
      </div>

      {/* Menu */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          zIndex: 1,
          paddingRight: 2,
        }}
      >
        <Nav
          className="flex-column"
        >
          {/* Section title */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color:
                "rgba(255,255,255,.38)",
              letterSpacing: "1.4px",
              padding: "0 14px",
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            Menu Utama
          </div>

          {/* Beranda */}
          <Nav.Link
            as={Link}
            to="/"
            style={menuStyle(
              location.pathname === "/"
            )}
          >
            <MdOutlineHome size={20} />
            <span>Beranda</span>
          </Nav.Link>

          {/* User */}
          <Nav.Link
            as={Link}
            to="/user-management"
            style={menuStyle(
              location.pathname ===
                "/user-management"
            )}
          >
            <MdOutlineGroups size={20} />
            <span>User Management</span>
          </Nav.Link>

          {/* Leads */}
          <Nav.Link
            as={Link}
            to="/leads-management"
            style={menuStyle(
              location.pathname ===
                "/leads-management"
            )}
          >
            <MdOutlinePeople size={20} />
            <span>Leads Management</span>
          </Nav.Link>

          {/* Kelas LMS */}
          <div style={{ marginTop: 5 }}>
            <div
              onClick={() =>
                setOpenKelas(!openKelas)
              }
              style={{
                ...dropdownTitleStyle,
                background: openKelas
                  ? "rgba(255,255,255,.08)"
                  : "transparent",
              }}
            >
              {openKelas ? (
                <MdKeyboardArrowDown size={18} />
              ) : (
                <MdKeyboardArrowRight size={18} />
              )}

              <MdOutlineMenuBook size={20} />

              <span
                style={{ flex: 1 }}
              >
                Kelas LMS
              </span>

              {openKelas && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: 0.7,
                  }}
                />
              )}
            </div>

            {openKelas && (
              <div
                style={{
                  marginLeft: 27,
                  marginTop: 5,
                  paddingLeft: 8,
                  borderLeft:
                    "1px solid rgba(255,255,255,.12)",
                }}
              >
                <Nav.Link
                  as={Link}
                  to="/presensi"
                  style={submenuStyle(
                    location.pathname ===
                      "/presensi"
                  )}
                >
                  <MdOutlineAssignment
                    size={18}
                  />
                  <span>
                    Presensi Peserta
                  </span>
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/nilai"
                  style={submenuStyle(
                    location.pathname ===
                      "/nilai"
                  )}
                >
                  <MdOutlineDashboardCustomize
                    size={18}
                  />
                  <span>Input Nilai</span>
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/sertifikat"
                  style={submenuStyle(
                    location.pathname ===
                      "/sertifikat"
                  )}
                >
                  <MdOutlineWorkspacePremium
                    size={18}
                  />
                  <span>Sertifikat</span>
                </Nav.Link>
              </div>
            )}
          </div>

          {/* Master Data */}
          <div style={{ marginTop: 5 }}>
            <div
              onClick={() =>
                setOpenMaster(!openMaster)
              }
              style={{
                ...dropdownTitleStyle,
                background: openMaster
                  ? "rgba(255,255,255,.08)"
                  : "transparent",
              }}
            >
              {openMaster ? (
                <MdKeyboardArrowDown size={18} />
              ) : (
                <MdKeyboardArrowRight size={18} />
              )}

              <MdOutlineStorage size={20} />

              <span
                style={{ flex: 1 }}
              >
                Master Data
              </span>

              {openMaster && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: 0.7,
                  }}
                />
              )}
            </div>

            {openMaster && (
              <div
                style={{
                  marginLeft: 27,
                  marginTop: 5,
                  paddingLeft: 8,
                  borderLeft:
                    "1px solid rgba(255,255,255,.12)",
                }}
              >
                <Nav.Link
                  as={Link}
                  to="/banner"
                  style={submenuStyle(
                    location.pathname ===
                      "/banner"
                  )}
                >
                  <MdOutlineImage
                    size={18}
                  />
                  <span>Main Banner</span>
                </Nav.Link>

                {/* Kelas - dinonaktifkan sementara (belum siap), tidak bisa dinavigasi */}
                <div
                  onClick={(e) => e.preventDefault()}
                  style={submenuDisabledStyle}
                  title="Belum tersedia"
                >
                  <MdOutlineSchool
                    size={18}
                  />
                  <span>Kelas</span>
                </div>

                <Nav.Link
                  as={Link}
                  to="/event"
                  style={submenuStyle(
                    location.pathname ===
                      "/event"
                  )}
                >
                  <MdOutlineEvent
                    size={18}
                  />
                  <span>Event</span>
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/voucher"
                  style={submenuStyle(
                    location.pathname ===
                      "/voucher"
                  )}
                >
                  <MdOutlineCardGiftcard
                    size={18}
                  />
                  <span>Voucher</span>
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/blog"
                  style={submenuStyle(
                    location.pathname ===
                      "/blog"
                  )}
                >
                  <MdOutlineArticle
                    size={18}
                  />
                  <span>Blog</span>
                </Nav.Link>
              </div>
            )}
          </div>
        </Nav>
      </div>

      {/* Bottom */}
      <div
        style={{
          marginTop: 12,
          position: "relative",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          style={{
            width: "100%",
            height: 42,
            background:
              "rgba(255,255,255,.10)",
            border:
              "1px solid rgba(255,255,255,.10)",
            borderRadius: 12,
            color: "#fff",
            fontWeight: 600,
            fontSize: 13.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            marginBottom: 12,
            boxShadow:
              "0 8px 20px rgba(0,0,0,.08)",
            cursor: "pointer",
            transition: ".25s",
            position: "relative",
            zIndex: 20,
          }}
        >
          <MdLogout size={19} />
          Keluar
        </button>

        {/* Profile Card */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.06))",
            borderRadius: 14,
            padding: 10,
            border:
              "1px solid rgba(255,255,255,.10)",
            boxShadow:
              "0 10px 25px rgba(0,0,0,.10)",
            position: "relative",
            zIndex: 20,
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
                  width: "100%",
                  gap: 10,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    minWidth: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background:
                      "linear-gradient(135deg,#fff,#e8edff)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#2539A8",
                    fontWeight: 800,
                    fontSize: 15,
                    boxShadow:
                      "0 5px 12px rgba(0,0,0,.14)",
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
                    user.inisial
                  )}
                </div>

                {/* Name */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 650,
                      fontSize: 13,
                      overflow: "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.nama}
                  </div>

                  <div
                    style={{
                      color:
                        "rgba(255,255,255,.52)",
                      fontSize: 10.5,
                      marginTop: 2,
                    }}
                  >
                    Administrator
                  </div>
                </div>

                <MdKeyboardArrowDown
                  size={18}
                  color="rgba(255,255,255,.7)"
                />
              </div>
            </Dropdown.Toggle>

            {/* HANYA PROFILE */}
            <Dropdown.Menu
              style={{
                minWidth: 190,
                border: "none",
                borderRadius: 14,
                padding: 8,
                boxShadow:
                  "0 15px 40px rgba(15,23,42,.18)",
              }}
            >
              <Dropdown.Header
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  padding: "7px 10px",
                }}
              >
                AKUN SAYA
              </Dropdown.Header>

              <Dropdown.Divider
                style={{
                  margin: "4px 0 6px",
                }}
              />

              <Dropdown.Item
                onClick={() =>
                  navigate("/profile")
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 9,
                  padding: "10px",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <MdPersonOutline
                  size={19}
                />
                Profile

                <MdChevronRight
                  size={17}
                  style={{
                    marginLeft: "auto",
                  }}
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;