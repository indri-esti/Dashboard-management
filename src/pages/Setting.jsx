
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash, FaTrashAlt,  } from "react-icons/fa";
import { Row, Col, Card } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

function Settings() {

  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // 1,2 detik
  
    return () => clearTimeout(timer);
  }, []);
  

  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const navigate = useNavigate();

 const defaultSettings = {
  nama: "Admin LMS",
  tanggalLahir: "2010-03-03",
  jenisKelamin: "Laki-Laki",
  email: "admin@gmail.com",
  telepon: "081234567890",
  alamat: "Semarang, Jawa Tengah",

  foto: "",

  passwordLama: "",
  passwordBaru: "",
  konfirmasiPassword: "",

  // Preferensi
  bahasa: "Bahasa Indonesia",
  notifikasiEmail: true,
  profilPublik: true,

  // Keamanan
  twoFactor: false,
};

const [settings, setSettings] = useState(() => {
  const data = JSON.parse(localStorage.getItem("profileData"));

  return data
    ? { ...defaultSettings, ...data }
    : defaultSettings;
});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleFoto = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setSettings((prev) => ({
      ...prev,
      foto: reader.result,
    }));
  };

  reader.readAsDataURL(file);
};

const handleHapusFoto = () => {
  Swal.fire({
    title: "Hapus Foto?",
    text: "Foto profil akan dihapus.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#ef4444",
  }).then((result) => {
    if (result.isConfirmed) {
      setSettings((prev) => ({
        ...prev,
        foto: "",
      }));

      // update profileData
      const profile =
        JSON.parse(localStorage.getItem("profileData")) || {};

      profile.foto = "";

      localStorage.setItem(
        "profileData",
        JSON.stringify(profile)
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Foto profil berhasil dihapus.",
        confirmButtonColor: "#243bb8",
      });
    }
  });
};

  const handleSave = () => {
  if (
    settings.passwordBaru &&
    settings.passwordBaru !== settings.konfirmasiPassword
  ) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Konfirmasi password tidak sesuai",
    });
    return;
  }

  // simpan data profile
  localStorage.setItem(
    "profileData",
    JSON.stringify({
      nama: settings.nama,
      email: settings.email,
      telepon: settings.telepon,
      alamat: settings.alamat,
      tanggalLahir: settings.tanggalLahir,
      jenisKelamin: settings.jenisKelamin,
      role: "Administrator",

      foto: settings.foto,
    })
  );

  // simpan pengaturan
  localStorage.setItem(
    "settingsData",
    JSON.stringify(settings)
  );

  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: "Pengaturan berhasil diperbarui",
    confirmButtonColor: "#243bb8",
  });
};

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Yakin ingin keluar dari sistem?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#243bb8",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#1e293b",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    textAlign: "left",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#334155",
  };

  const fieldCardStyle = {
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: "14px",
  padding: "18px 20px",   
  transition: "all .2s ease",
  boxShadow: "0 2px 8px rgba(15,23,42,.04)",
};

const modernInputStyle = {
  width: "100%",
  marginTop: "8px",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "15px",
  color: "#1E293B",
  padding: "4px 0",
};

const handleTwoFactor = () => {
  const status = !settings.twoFactor;

  setSettings({
    ...settings,
    twoFactor: status,
  });

  if (status) {
    Swal.fire({
      icon: "success",
      title: "Verifikasi Dua Langkah Aktif",
      text: "Kode verifikasi akan dikirim ke email saat login.",
      confirmButtonColor: "#243bb8",
    });
  }
};

useEffect(() => {
  const data = localStorage.getItem("profileData");

  if (data) {
    const profile = JSON.parse(data);

    setSettings({
      ...defaultSettings,
      ...profile,
    });
  }
}, []);


const handlePrivacy = () => {
  Swal.fire({
    title: "Kebijakan Privasi",
    html: `
      <div style="text-align:left">
        <p>• Data akun digunakan hanya untuk kebutuhan pembelajaran.</p>
        <p>• Informasi pribadi tidak dibagikan kepada pihak lain.</p>
        <p>• Foto profil dan identitas disimpan secara lokal.</p>
        <p>• Pengguna bertanggung jawab menjaga keamanan akun.</p>
      </div>
    `,
    icon: "info",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#243bb8",
    width: 600,
  });
};

const handleTerms = () => {
  Swal.fire({
    title: "Syarat & Ketentuan",
    html: `
      <div style="text-align:left">
        <p>• Aplikasi digunakan untuk kegiatan pembelajaran.</p>
        <p>• Pengguna wajib menjaga kerahasiaan akun.</p>
        <p>• Dilarang menyalahgunakan fitur LMS.</p>
        <p>• Penggunaan aplikasi mengikuti kebijakan institusi.</p>
      </div>
    `,
    icon: "info",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#243bb8",
    width: 600,
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
            Memuat Pengaturan
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
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
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
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    overflow: "hidden",
    background:"linear-gradient(135deg,#FFFFFF,#E8EEFF)",
border:"5px solid rgba(255,255,255,.25)",
boxShadow:"0 15px 35px rgba(0,0,0,.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
    <div
  style={{
    position:"absolute",
    width:"230px",
    height:"230px",
    borderRadius:"50%",
    background:"rgba(255,255,255,.08)",
    top:"-90px",
    right:"-70px",
  }}
/>

<div
  style={{
    position:"absolute",
    width:"160px",
    height:"160px",
    borderRadius:"50%",
    background:"rgba(255,255,255,.05)",
    bottom:"-60px",
    left:"-40px",
  }}
/>

  {settings.foto ? (
    <img
      src={settings.foto}
      alt="Profile"
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
      {settings.nama.charAt(0).toUpperCase()}
    </span>
  )}
</div>

          <div>
            <h2  style={{
  margin: 0,
  fontWeight: 700,
  fontSize: "32px",
}}>
              Settings Account
            </h2>

            <p
              style={{
  marginTop: "8px",
  marginBottom: "14px",
  opacity: ".92",
  fontSize: "16px",
}}
            >
              Kelola akun dan keamanan sistem
            </p>
          </div>
        </div>

        {/* INFORMASI AKUN */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "20px",
            marginBottom: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,.05)",
          }}
        >
          <h3
            style={{
              marginBottom: "25px",
              color: "#1e293b",
            }}
          >
            Informasi Akun
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >

            <div
  style={fieldCardStyle}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
  <label
    style={{
      fontSize: "13px",
      color: "#64748B",
      fontWeight: 600,
      marginBottom: "6px",
      display: "block",
    }}
  >
    Nama Lengkap
  </label>

  <input
    name="nama"
    value={settings.nama}
    onChange={handleChange}
    placeholder="Masukkan nama lengkap"
    style={modernInputStyle}
  />
</div>

            
            <div
  style={fieldCardStyle}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
  <label style={labelStyle}>
    Tanggal Lahir
  </label>

  <input
    type="date"
    name="tanggalLahir"
    value={settings.tanggalLahir}
    onChange={handleChange}
    style={modernInputStyle}
  />

</div>


              <div
  style={fieldCardStyle}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
              <label style={labelStyle}>
                Jenis Kelamin
              </label>

              <select
                name="jenisKelamin"
                value={settings.jenisKelamin}
                onChange={handleChange}
                style={inputStyle}
              >
                <option>Laki-Laki</option>
                <option>Perempuan</option>
              </select>
            </div>

              <div
  style={fieldCardStyle}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
              <label style={labelStyle}>
                Email
              </label>

              <input
                name="email"
                value={settings.email}
                onChange={handleChange}
                style={modernInputStyle}
              />
            </div>

              <div
  style={fieldCardStyle}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
              <label style={labelStyle}>
                Nomor Telepon
              </label>

              <input
                name="telepon"
                value={settings.telepon}
                onChange={handleChange}
                style={modernInputStyle}
              />
            </div>

              <div
  style={fieldCardStyle}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
              <label style={labelStyle}>
                Foto Profil
              </label>

              <input
  type="file"
  accept="image/*"
  onChange={handleFoto}
  style={modernInputStyle}
/>

{settings.foto && (
  <div
    style={{
      marginTop: "15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <img
      src={settings.foto}
      alt="Foto Profil"
      style={{
        width: "110px",
        height: "110px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #243bb8",
      }}
    />

    <button
      type="button"
      onClick={handleHapusFoto}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "8px 14px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      <FaTrashAlt />
      Hapus Foto
    </button>
  </div>
)}
            </div>
          </div>

          <div
  style={{
    ...fieldCardStyle,
    marginTop: "18px",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
  <label
    style={{
      display: "block",
      marginBottom: "8px",
      fontSize: "13px",
      fontWeight: "600",
      color: "#64748B",
    }}
  >
    Alamat
  </label>

  <textarea
    rows={4}
    name="alamat"
    value={settings.alamat}
    onChange={handleChange}
    placeholder="Masukkan alamat lengkap..."
    style={{
      width: "100%",
      border: "none",
      outline: "none",
      background: "transparent",
      resize: "none",
      fontSize: "15px",
      color: "#1E293B",
      lineHeight: "1.6",
      minHeight: "90px",
    }}
  />
</div>
</div>

        {/* KEAMANAN */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "20px",
            marginBottom: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,.05)",
          }}
        >
          <h3
            style={{
              marginBottom: "25px",
              color: "#1e293b",
            }}
          >
            Keamanan
          </h3>

            <div
  style={fieldCardStyle}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
            <label style={labelStyle}>
              Password Lama
            </label>

            <div style={{ position: "relative" }}>
  <input
    type={showPasswordLama ? "text" : "password"}
    name="passwordLama"
    value={settings.passwordLama}
    onChange={handleChange}
    style={{
      ...inputStyle,
      paddingRight: "45px",
    }}
  />

  <span
    onClick={() => setShowPasswordLama(!showPasswordLama)}
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#64748b",
    }}
  >
    {showPasswordLama ? <FaEye /> : <FaEyeSlash/>}
  </span>
</div>
</div>


     <div
  style= {{ 
    marginTop: "20px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    transition: "all .2s ease",
    boxShadow: "0 2px 8px rgba(15,23,42,.04)",
    }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
  <label style={labelStyle}>
    Password Baru
  </label>

  <div
    style={{
      position: "relative",
      marginTop: "10px", // memberi jarak label dengan input
    }}
  >
    <input
      type={showPasswordBaru ? "text" : "password"}
      name="passwordBaru"
      value={settings.passwordBaru}
      onChange={handleChange}
      placeholder="Masukkan password baru"
      style={{
        ...inputStyle,
        paddingRight: "45px",
      }}
    />

    <span
      onClick={() =>
        setShowPasswordBaru(!showPasswordBaru)
      }
      style={{
        position: "absolute",
        right: "18px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#64748B",
      }}
    >
      {showPasswordBaru ? <FaEye /> : <FaEyeSlash />}
    </span>
  </div>
</div>


          <div
  style={{
    marginTop: "20px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    transition: "all .2s ease",
    boxShadow: "0 2px 8px rgba(15,23,42,.04)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
  <label style={labelStyle}>
    Konfirmasi Password
  </label>

  <div style={{ position: "relative" }}>
    <input
      type={showKonfirmasi ? "text" : "password"}
      name="konfirmasiPassword"
      value={settings.konfirmasiPassword}
      onChange={handleChange}
      placeholder="Masukan Konfirmasi password"
      style={{
        ...inputStyle,
        paddingRight: "45px",
      }}
    />

    <span
      onClick={() =>
        setShowKonfirmasi(!showKonfirmasi)
      }
      style={{
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#64748b",
      }}
    >
      {showKonfirmasi ? (
        <FaEye />
      ) : (
        <FaEyeSlash />
      )}
    </span>
  </div>
</div>

       <div
  style={{
    marginTop: "20px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    transition: "all .2s ease",
    boxShadow: "0 2px 8px rgba(15,23,42,.04)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "#2538C8";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(37,56,200,.10)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow =
      "0 2px 8px rgba(15,23,42,.04)";
  }}
>
  <div>
    <h4
      style={{
        margin: 0,
        fontSize: "16px",
        fontWeight: 600,
        color: "#1E293B",
      }}
    >
      Verifikasi Dua Langkah (2FA)
    </h4>

    <p
      style={{
        margin: "6px 0 0",
        fontSize: "13px",
        color: "#64748B",
        lineHeight: 1.5,
      }}
    >
      Tingkatkan keamanan akun dengan verifikasi melalui email.
    </p>
  </div>

  

           <label
  style={{
    position: "relative",
    display: "inline-block",
    width: "54px",
    height: "30px",
    cursor: "pointer",
  }}
>
  <input
    type="checkbox"
    checked={settings.twoFactor}
    onChange={handleTwoFactor}
    style={{
      opacity: 0,
      width: 0,
      height: 0,
    }}
  />

  <span
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: "30px",
      background: settings.twoFactor
        ? "#243bb8"
        : "#cbd5e1",
      transition: ".3s",
    }}
  >
    <span
      style={{
        position: "absolute",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        background: "#fff",
        top: "4px",
        left: settings.twoFactor
          ? "28px"
          : "4px",
        transition: ".3s",
        boxShadow: "0 2px 8px rgba(0,0,0,.2)",
      }}
    />
  </span>
</label>
          </div>
        </div>

        {/* TOMBOL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px", // tambahan
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={handleBack}
              style={{
                background:"#fff",
border:"1px solid #CBD5E1",
                padding: "12px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Kembali
            </button>

            <button
              onClick={handleLogout}
              style={{
                border: "none",
                background: "#ef4444",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>

          <button
            onClick={handleSave}
            style={{
              border: "none",
              background:
"linear-gradient(135deg,#243BB8,#4F6BFF)",
boxShadow:"0 12px 24px rgba(36,59,184,.25)",
fontWeight:"600",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Simpan Perubahan
          </button>
        </div>
        </div>


{/* TENTANG APLIKASI */}
<div
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,.05)",
  }}
>
  <h3
    style={{
      marginBottom: "25px",
      color: "#1e293b",
      fontWeight: "700",
    }}
  >
    Tentang Aplikasi
  </h3>

 {/* Header */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
  }}
>
    <div
  style={{
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "linear-gradient(135deg,#243bb8,#3b82f6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "28px",
    marginBottom: "18px",
    boxShadow: "0 10px 20px rgba(36,59,184,.25)",
  }}
>
  LMS
</div>

   <Card
  style={{
    border: "none",
    borderRadius: "16px",
    background: "linear-gradient(135deg,#243bb8,#3b82f6)",
    color: "#fff",
    marginBottom: "20px",
  }}
>
  <Card.Body>
    <h5 style={{ fontWeight: "700" }}>
      Learning Management System
    </h5>

    <p style={{ margin: 0, opacity: 0.9 }}>
      Sistem ini membantu proses pembelajaran dengan
      pengelolaan kelas, materi, tugas, nilai, dan
      aktivitas pengguna secara efisien.
    </p>
  </Card.Body>
</Card>
  </div>

 {/* Informasi Aplikasi */}
<Row className="g-3 mb-4">

  <Col md={6}>
    <Card
      style={{
        border: "none",
        borderRadius: "16px",
        background: "#f8fafc",
        boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      }}
    >
      <Card.Body>
        <small style={{ color: "#64748b" }}>
          Versi Aplikasi
        </small>

        <h5
          style={{
            marginTop: "10px",
            color: "#243bb8",
            fontWeight: "700",
          }}
        >
          v1.0.0
        </h5>

        <small style={{ color: "#94a3b8" }}>
          Versi terbaru
        </small>
      </Card.Body>
    </Card>
  </Col>

  <Col md={6}>
    <Card
      style={{
        border: "none",
        borderRadius: "16px",
        background: "#f8fafc",
        boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      }}
    >
      <Card.Body>
        <small style={{ color: "#64748b" }}>
          Framework
        </small>

        <h5
          style={{
            marginTop: "10px",
            color: "#243bb8",
            fontWeight: "700",
          }}
        >
          React JS + Vite
        </h5>

        <small style={{ color: "#94a3b8" }}>
          Frontend Development
        </small>
      </Card.Body>
    </Card>
  </Col>

  <Col md={6}>
    <Card
      style={{
        border: "none",
        borderRadius: "16px",
        background: "#f8fafc",
        boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      }}
    >
      <Card.Body>
        <small style={{ color: "#64748b" }}>
          Penyimpanan Data
        </small>

        <h5
          style={{
            marginTop: "10px",
            color: "#243bb8",
            fontWeight: "700",
          }}
        >
          Local Storage
        </h5>

        <small style={{ color: "#94a3b8" }}>
          Penyimpanan browser
        </small>
      </Card.Body>
    </Card>
  </Col>

  <Col md={6}>
    <Card
      style={{
        border: "none",
        borderRadius: "16px",
        background: "#f8fafc",
        boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      }}
    >
      <Card.Body>
        <small style={{ color: "#64748b" }}>
          Developer
        </small>

        <h5
          style={{
            marginTop: "10px",
            color: "#243bb8",
            fontWeight: "700",
          }}
        >
          LMS Team
        </h5>

        <small style={{ color: "#94a3b8" }}>
          React JS Project
        </small>
      </Card.Body>
    </Card>
  </Col>

</Row>

  {/* Menu */}
  <div
    onClick={handlePrivacy}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px",
      borderRadius: "12px",
      background: "#f8fafc",
      marginBottom: "12px",
      cursor: "pointer",
      transition: ".2s",
    }}
  >
    <div>
      <strong>Kebijakan Privasi</strong>
      <p
        style={{
          margin: "5px 0 0",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        Pelajari bagaimana data pengguna dikelola.
      </p>
    </div>

    <span
      style={{
        color: "#243bb8",
        fontWeight: "700",
        fontSize: "18px",
      }}
    >
      →
    </span>
  </div>

  <div
    onClick={handleTerms}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px",
      borderRadius: "12px",
      background: "#f8fafc",
      cursor: "pointer",
      transition: ".2s",
    }}
  >
    <div>
      <strong>Syarat & Ketentuan</strong>
      <p
        style={{
          margin: "5px 0 0",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        Ketentuan penggunaan aplikasi Learning Management System.
      </p>
    </div>

    <span
      style={{
        color: "#243bb8",
        fontWeight: "700",
        fontSize: "18px",
      }}
    >
      →
    </span>
  </div>
</div>
</div>
     
  );
}

export default Settings;