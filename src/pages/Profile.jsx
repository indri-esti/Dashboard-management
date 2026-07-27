import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";


function Profile() {

  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // 1,2 detik
  
    return () => clearTimeout(timer);
  }, []);
  

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const defaultProfile = {
    nama: "Admin LMS",
    email: "admin@gmail.com",
    telepon: "081234567890",
    alamat: "Semarang, Jawa Tengah",
    role: "Administrator",
    joinDate: "2026-06-29",
    foto: "",
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);

  useEffect(() => {
    const loadProfile = () => {
      const data = JSON.parse(localStorage.getItem("profileData"));

      if (data) {
        const newProfile = {
          ...defaultProfile,
          ...data,
        };

        setProfile(newProfile);
        setFormData(newProfile);
      } else {
        setProfile(defaultProfile);
        setFormData(defaultProfile);
      }
    };

    loadProfile();

    window.addEventListener("storage", loadProfile);
    window.addEventListener("focus", loadProfile);

    return () => {
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("focus", loadProfile);
    };
  }, []);

  const handleBack = () => {
    Swal.fire({
      title: "Kembali?",
      text: "Kembali ke halaman sebelumnya",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#243bb8",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(-1);
      }
    });
  };

  const handleSave = () => {
  const newProfile = {
    ...profile,
    ...formData,
    joinDate: profile.joinDate || new Date().toISOString().split("T")[0],
  };

  localStorage.setItem(
    "profileData",
    JSON.stringify(newProfile)
  );

  setProfile(newProfile);

  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: "Profile berhasil diperbarui",
    confirmButtonColor: "#243bb8",
  });

  setShowModal(false);
};

const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";

  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
         background:
  "linear-gradient(135deg,#1E2A78 0%, #243BB8 45%, #4F6BFF 100%)",
border: "1px solid rgba(255,255,255,.08)",
boxShadow:
  "0 20px 45px rgba(30,42,120,.35)",
position: "relative",
overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "360px",
            background: "#fff",
            borderRadius: "28px",
            padding: "45px 35px",
            textAlign: "center",
            boxShadow: "0 20px 45px rgba(37,99,235,.12)",
          }}
        >
          {/* Lingkaran */}
          <div
            style={{
              width: "95px",
              height: "95px",
              margin: "0 auto",
              borderRadius: "50%",
              background: "#EFF6FF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <Spinner
              animation="border"
              variant="primary"
              style={{
                width: "45px",
                height: "45px",
                borderWidth: "4px",
              }}
            />
          </div>
  
          <h4
            style={{
              fontWeight: "700",
              color: "#1E293B",
              marginBottom: "10px",
            }}
          >
            Memuat Profile
          </h4>
  
          <p
            style={{
              color: "#64748B",
              fontSize: "15px",
              marginBottom: "25px",
            }}
          >
            Mohon Tunggu Sebentar.
          </p>
        </div>
      </div>
    );
  }

 return (
  <div
    style={{
  minHeight: "100vh",
  background: "linear-gradient(180deg,#F8FAFC,#EEF4FF)",
  padding: "40px",
}}
  >
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* HEADER PROFILE */}
      <div
        style={{
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  gap: "25px",
  padding: "35px",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg,#1E2A78 0%,#243BB8 45%,#4F6BFF 100%)",
  color: "#fff",
  marginBottom: "28px",
  border: "1px solid rgba(255,255,255,.08)",
  boxShadow: "0 20px 45px rgba(30,42,120,.35)",
}}
      >
        <div
  style={{
    position: "absolute",
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    background: "rgba(255,255,255,.08)",
    right: "-70px",
    top: "-90px",
  }}
/>

<div
  style={{
    position: "absolute",
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    background: "rgba(255,255,255,.05)",
    left: "-40px",
    bottom: "-70px",
  }}
/>
        <div
  style={{
  width: "115px",
  height: "115px",
  borderRadius: "50%",
  overflow: "hidden",
  background: "linear-gradient(135deg,#fff,#E8EEFF)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "5px solid rgba(255,255,255,.25)",
  boxShadow: "0 15px 35px rgba(0,0,0,.25)",
  flexShrink: 0,
  zIndex: 2,
}}
>
  {profile.foto ? (
    <img
      src={profile.foto}
      alt="Foto Profil"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  ) : (
    <span
     style={{
  fontSize: "46px",
  fontWeight: "700",
  color: "#243BB8",
}}
    >
      {profile.nama.charAt(0).toUpperCase()}
    </span>
  )}
</div>

        <div>
          <h2
            style={{
  margin: 0,
  fontWeight: 700,
  fontSize: "32px",
}}
          >
            {profile.nama}
          </h2>

          <p
            style={{
  marginTop: "8px",
  marginBottom: "14px",
  opacity: ".92",
  fontSize: "16px",
}}
          >
            {profile.role}
          </p>

          <span
           style={{
  display: "inline-block",
  background: "rgba(255,255,255,.12)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,.18)",
  padding: "9px 18px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "600",
  letterSpacing: ".5px",
}}
          >
            Active Account
          </span>
        </div>
      </div>

      {/* INFORMASI PROFILE */}
      <div
        style={{
  background: "#fff",
  padding: "28px",
  borderRadius: "22px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 15px 35px rgba(15,23,42,.06)",
}}
      >
        <h3
          style={{
  marginBottom: "25px",
  color: "#1E293B",
  fontWeight: "700",
}}
        >
          Informasi Profile
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          <div
            style={{
  background: "#F8FAFC",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
}}
          >
            <small style={{ color: "#64748b" }}>
              Email
            </small>

            <p
              style={{
                marginTop: "8px",
                fontWeight: "600",
              }}
            >
              {profile.email}
            </p>
          </div>

          <div
           style={{
  background: "#F8FAFC",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
}}
          >
            <small style={{ color: "#64748b" }}>
              Nomor Telepon
            </small>

            <p
              style={{
                marginTop: "8px",
                fontWeight: "600",
              }}
            >
              {profile.telepon}
            </p>
          </div>

          <div
            style={{
  background: "#F8FAFC",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
}}
          >
            <small style={{ color: "#64748b" }}>
              Alamat
            </small>

            <p
              style={{
                marginTop: "8px",
                fontWeight: "600",
              }}
            >
              {profile.alamat}
            </p>
          </div>

          <div
            style={{
  background: "#F8FAFC",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
}}
          >
            <small style={{ color: "#64748b" }}>
              Bergabung Sejak
            </small>

            <p
              style={{
                marginTop: "8px",
                fontWeight: "600",
              }}
            >
              {formatTanggal(profile.joinDate)}
            </p>
          </div>
        </div>

        {/* TOMBOL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <button
            onClick={handleBack}
            style={{
  background: "#fff",
  border: "1px solid #CBD5E1",
  color: "#475569",
  padding: "12px 24px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  transition: ".2s",
}}
          >
            Kembali
          </button>

         <button
  onClick={() => {
    const data = JSON.parse(localStorage.getItem("profileData"));

    if (data) {
      setFormData({
        ...defaultProfile,
        ...data,
      });
    } else {
      setFormData(profile);
    }

    setShowModal(true);
  }}
 style={{
  border: "none",
  background:
    "linear-gradient(135deg,#243BB8,#4F6BFF)",
  color: "#fff",
  padding: "12px 24px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow: "0 12px 24px rgba(36,59,184,.25)",
  transition: ".25s",
}}
>
  Edit Profile
</button>
        </div>
      </div>
    </div>
  

    {/* MODAL */}
    {showModal && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <div
          style={{
  width: "500px",
  background: "#fff",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 25px 60px rgba(15,23,42,.18)",
}}
        >
          <h3
            style={{
              marginBottom: "20px",
              color: "#1e293b",
            }}
          >
            Edit Profile
          </h3>

         <div style={{ marginBottom: "15px" }}>
  <label
    style={{
      display: "block",
      textAlign: "left",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "6px",
    }}
  >
    Nama Lengkap
  </label>

  <input
    type="text"
    placeholder="Masukkan nama lengkap"
    value={formData.nama}
    onChange={(e) =>
      setFormData({
        ...formData,
        nama: e.target.value,
      })
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      backgroundColor: "#ffffff",
      color: "#1e293b",
      outline: "none",
      boxSizing: "border-box",
    }}
  />
</div>

<div style={{ marginBottom: "15px" }}>
  <label
    style={{
      display: "block",
      textAlign: "left",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "6px",
    }}
  >
    Email
  </label>

  <input
    type="email"
    placeholder="Masukkan email"
    value={formData.email}
    onChange={(e) =>
      setFormData({
        ...formData,
        email: e.target.value,
      })
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      backgroundColor: "#ffffff",
      color: "#1e293b",
      outline: "none",
      boxSizing: "border-box",
    }}
  />
</div>

<div style={{ marginBottom: "15px" }}>
  <label
    style={{
      display: "block",
      textAlign: "left",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "6px",
    }}
  >
    No. Telepon
  </label>

  <input
    type="text"
    placeholder="Masukkan nomor telepon"
    value={formData.telepon}
    onChange={(e) =>
      setFormData({
        ...formData,
        telepon: e.target.value,
      })
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      backgroundColor: "#ffffff",
      color: "#1e293b",
      outline: "none",
      boxSizing: "border-box",
    }}
  />
</div>

<div style={{ marginBottom: "20px" }}>
  <label
    style={{
      display: "block",
      textAlign: "left",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "6px",
    }}
  >
    Alamat
  </label>

  <textarea
    rows="3"
    placeholder="Masukkan alamat"
    value={formData.alamat}
    onChange={(e) =>
      setFormData({
        ...formData,
        alamat: e.target.value,
      })
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      resize: "none",
      backgroundColor: "#ffffff",
      color: "#1e293b",
      outline: "none",
      boxSizing: "border-box",
    }}
  />
</div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#f73232",
                color:"#fff",
fontWeight:"600",
cursor:"pointer",
              }}
            >
              Batal
            </button>

            <button
              onClick={handleSave}
              style={{
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  background:
    "linear-gradient(135deg,#243BB8,#4F6BFF)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
}}
            >
              Simpan
            </button>
           </div>
        </div>
      </div>
    )}
  </div>
 );
}

export default Profile;