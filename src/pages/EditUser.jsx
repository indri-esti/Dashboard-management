import { useState, useEffect } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";

import {
  FaTimes,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { format, parse } from "date-fns";

import { useNavigate, useParams } from "react-router-dom";

import IndonesiaFlag from "../assets/id.svg";

// sesuaikan path ini dengan lokasi api.js kamu
import api from "../api";

// Backend menyimpan status sebagai 'active' / 'non active' (huruf kecil, ada spasi).
// Normalisasi sekali di sini biar konsisten dengan UserManagement.jsx
const isActiveStatus = (status) =>
  (status || "").toLowerCase().trim() === "active";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  // style input (sama seperti AddUser)
  const inputStyle = {
    height: "48px",
    fontSize: "15px",
    fontWeight: "500",
    paddingLeft: "14px",
    borderRadius: "12px",
    border: "1px solid #D9DDE7",
    boxShadow: "none",
  };

  // Loading saat ambil data awal user
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Loading saat submit / simpan
  const [saving, setSaving] = useState(false);

  //animate button
  const [cancelPressed, setCancelPressed] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const [saveHover, setSaveHover] = useState(false);

  const [isPressed, setIsPressed] = useState(false);

  // toast (untuk sukses / batal)
  const [showToast, setShowToast] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  // banner error di atas card (sesuai figma "Ups, Data User gagal diperbarui")
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(
    "Pastikan memasukkan data yang benar. Coba lagi!"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [nama, setNama] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tanggal, setTanggal] = useState(null);
  const [role, setRole] = useState("");
  const [kelasId, setKelasId] = useState("");

  // status user (Active / Non Active) -> menentukan apakah field
  // "Alasan Non Active" ditampilkan
  const [status, setStatus] = useState("Active");
  const [alasanNonActive, setAlasanNonActive] = useState("");

  // section kata sandi
  const [resetPassword, setResetPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [namaError, setNamaError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [tanggalError, setTanggalError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [alasanError, setAlasanError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // daftar role diambil dari backend (/api/roles) -> hanya Admin & Member
  // (tidak ada lagi role hardcode seperti Staff / Guru)
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [kelasList, setKelasList] = useState([]);
  const [kelasLoading, setKelasLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/api/roles");
        setRoles(res.data?.data || []);
      } catch (err) {
        console.error("Gagal mengambil data role:", err);
      } finally {
        setRolesLoading(false);
      }
    };

    const fetchKelas = async () => {
      try {
        const res = await api.get("/api/kelas");
        const list = (res.data?.data || []).filter(
          (item) =>
            (item.status || "active").toLowerCase().trim() === "active"
        );
        setKelasList(list);
      } catch (err) {
        console.error("Gagal mengambil data kelas:", err);
        setKelasList([]);
      } finally {
        setKelasLoading(false);
      }
    };

    fetchRoles();
    fetchKelas();
  }, []);

  // ambil data user yang mau diedit dari backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setInitialLoading(true);
        setLoadError("");

        const res = await api.get(`/api/users/${id}`);
        const found = res.data?.data || res.data;

        if (!found) {
          setLoadError("Data user tidak ditemukan.");
          return;
        }

        setTitle(found.title || "");
        setNama(found.nama || "");
        setPhone(found.phone || "");
        setEmail(found.email || "");

        // Kalau user lama memiliki data yang sama dengan salah satu
        // anggota kelas, pilih otomatis di dropdown kelas.
        const matchingKelas = kelasList.find(
          (item) =>
            String(item.nama || "").trim().toLowerCase() ===
              String(found.nama || "").trim().toLowerCase() &&
            String(item.email || "").trim().toLowerCase() ===
              String(found.email || "").trim().toLowerCase()
        );

        setKelasId(matchingKelas ? String(matchingKelas.id_kelas) : "");

        // sesuaikan: id role user saat ini. Coba beberapa kemungkinan nama field.
        setRole(found.role_id ?? found.id_role ?? "");

        const userStatus = isActiveStatus(found.status)
  ? "Active"
  : "Non Active";

setStatus(userStatus);

setAlasanNonActive(
  found.alasan_non_active ??
  found.alasan_nonactive ??
  found.alasanNonActive ??
  found.reason ??
  ""
);

        // sesuaikan: format tanggal_lahir dari backend (default: yyyy-MM-dd)
        if (found.tanggal_lahir) {
          try {
            if (found.tanggal_lahir.includes("/")) {
              setTanggal(parse(found.tanggal_lahir, "dd/MM/yyyy", new Date()));
            } else {
              setTanggal(parse(found.tanggal_lahir, "yyyy-MM-dd", new Date()));
            }
          } catch {
            setTanggal(null);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        setLoadError(
          err.response?.data?.message || "Gagal mengambil data user dari server."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id, kelasList]);

  const handleKelasChange = (e) => {
    const value = e.target.value;
    setKelasId(value);

    const selected = kelasList.find(
      (item) => String(item.id_kelas) === String(value)
    );

    if (!selected) return;

    setNama(selected.nama || "");
    setPhone(selected.phone || "");
    setEmail(selected.email || "");

    if (selected.role_id !== undefined && selected.role_id !== null) {
      setRole(String(selected.role_id));
    }
  };

  // tombol aktif / nonaktif
  const isFormValid =
    title !== "" &&
    nama.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "" &&
    tanggal !== null &&
    role !== "" &&
    (status !== "Non Active" || alasanNonActive.trim() !== "") &&
    (!resetPassword || (password !== "" && confirmPassword !== ""));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowBanner(false);

    setNamaError("");
    setPhoneError("");
    setEmailError("");
    setTanggalError("");
    setRoleError("");
    setAlasanError("");
    setPasswordError("");
    setConfirmError("");

    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!nama.trim()) {
      setNamaError("Nama lengkap wajib diisi");
      valid = false;
    }

    if (!phone.trim()) {
      setPhoneError("Nomor handphone wajib diisi");
      valid = false;
    } else if (phone.replace(/\D/g, "").length < 10) {
      setPhoneError("Minimal terdiri dari 10 angka");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Email wajib diisi");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Masukkan email yang valid");
      valid = false;
    }

    if (!tanggal) {
      setTanggalError("Tanggal lahir wajib diisi");
      valid = false;
    }

    if (!role) {
      setRoleError("Pilih role");
      valid = false;
    }

    if (status === "Non Active" && !alasanNonActive.trim()) {
      setAlasanError("Alasan non active wajib diisi");
      valid = false;
    }

    if (resetPassword) {
      if (!password) {
        setPasswordError("Password wajib diisi");
        valid = false;
      } else if (!passRegex.test(password)) {
        setPasswordError(
          "Min 8 karakter, kombinasi huruf besar-kecil, angka & karakter khusus"
        );
        valid = false;
      }

      if (!confirmPassword) {
        setConfirmError("Konfirmasi password wajib diisi");
        valid = false;
      } else if (password !== confirmPassword) {
        setConfirmError("Kata sandi tidak cocok");
        valid = false;
      }
    }

    if (!valid) {
      setBannerMessage("Pastikan memasukkan data yang benar. Coba lagi!");
      setShowBanner(true);
      return;
    }

    setSaving(true);

    try {
      const payload = {
  title,
  nama: nama.trim(),
  phone,
  email: email.trim().toLowerCase(),
  tanggal_lahir: tanggal
    ? format(tanggal, "yyyy-MM-dd")
    : null,
  role_id: role,
  status: status.toLowerCase(),
  alasan_non_active:
    status === "Non Active"
      ? alasanNonActive.trim()
      : "",
  ...(resetPassword ? { password } : {}),
};

      const res = await api.put(`/api/users/${id}`, payload);

      setAlertType("success");
      setAlertTitle("Berhasil!");
      setAlertDescription(
        res.data?.message || "Data user berhasil diperbarui."
      );
      setShowToast(true);

      setTimeout(() => {
        setSaving(false);
        setShowToast(false);
        navigate("/user-management");
      }, 1800);
    } catch (err) {
      setSaving(false);

      const statusCode = err.response?.status;
      const message = err.response?.data?.message;

      // email sudah terdaftar -> tunjukkan di field email
      if (statusCode === 409) {
        setEmailError(message || "Email sudah terdaftar");
      }

      setBannerMessage(
        message || "Pastikan memasukkan data yang benar. Coba lagi!"
      );
      setShowBanner(true);
    }
  };

  if (initialLoading) {
    return (
      <Container
        fluid
        style={{
          background: "#F5F7FB",
          minHeight: "100vh",
          padding: "40px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#2538C8" }} />
          <p className="mt-3" style={{ color: "#64748B" }}>
            Memuat data user...
          </p>
        </div>
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container
        fluid
        style={{
          background: "#F5F7FB",
          minHeight: "100vh",
          padding: "40px 0",
        }}
      >
        <Row className="justify-content-center">
          <Col xs={11} sm={9} md={7} lg={4} xl={4}>
            <div
              style={{
                background: "#FFF2F2",
                border: "1px solid #FFD4D4",
                color: "#D93025",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <FaExclamationTriangle color="#DC2626" style={{ marginTop: "3px" }} />
              <div style={{ flex: 1, fontSize: "14px", lineHeight: "20px" }}>
                {loadError}
              </div>
            </div>

            <Button
              className="mt-3"
              variant="outline-secondary"
              onClick={() => navigate("/user-management")}
            >
              Kembali
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container
      fluid
      style={{
        background: "#F5F7FB",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >

      <Row className="justify-content-center">
        <Col xs={11} sm={9} md={7} lg={4} xl={4}>

         {/* Toast Alert (sukses / batal) */}
      {showToast && (
        <div
         style={{
  width: "720px",
  maxWidth: "100%",
  minHeight: "78px",
  margin: "0 auto 24px",
  background:
    alertType === "success"
      ? "#ECFDF3"
      : alertType === "warning"
      ? "#FFF8E6"
      : "#FFF2F2",

  border:
    alertType === "success"
      ? "1px solid #ABEFC6"
      : alertType === "warning"
      ? "1px solid #FACC15"
      : "1px solid #FECACA",

  borderRadius: "16px",

  padding: "16px 22px",

  display: "flex",

  alignItems: "center",

  gap: "14px",

  boxShadow: "0 8px 24px rgba(0,0,0,.08)",
}}
        >
          <FaExclamationTriangle
            color={
              alertType === "success"
                ? "#16A34A"
                : alertType === "warning"
                ? "#D97706"
                : "#DC2626"
            }
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "15px",
                marginBottom: "3px",
              }}
            >
              {alertTitle}
            </div>

            <div
              style={{
                fontSize: "13px",
                opacity: 0.9,
                lineHeight: "18px",
              }}
            >
              {alertDescription}
            </div>
          </div>

          <FaTimes
            onClick={() => setShowToast(false)}
            style={{ cursor: "pointer", marginLeft: 10 }}
          />
        </div>
      )}
          {/* Banner error di atas card, sesuai screenshot ke-3 */}
          {showBanner && (
            <div
              style={{
                background: "#FFF2F2",
                border: "1px solid #FFD4D4",
                color: "#D93025",
                borderRadius: "12px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <FaExclamationTriangle
                color="#DC2626"
                style={{ marginTop: "3px" }}
              />

              <div style={{ flex: 1, fontSize: "14px", lineHeight: "20px" }}>
                <strong>Ups, Data User gagal diperbarui.</strong> {bannerMessage}
              </div>

              <FaTimes
                onClick={() => setShowBanner(false)}
                style={{ cursor: "pointer", marginTop: "3px" }}
              />
            </div>
          )}

          <Card
            style={{
              borderRadius: "22px",
              border: "none",
              boxShadow: "0 8px 30px rgba(0,0,0,.08)",
            }}
          >
            <Card.Body style={{ padding: "28px 24px" }}>
              <h3
                className="fw-bold text-center mb-4"
                style={{ color: "#31353F" }}
              >
                Edit Data User
              </h3>

              <Form onSubmit={handleSubmit}>
                {/* Data Kelas */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                      color: "#343A40",
                    }}
                  >
                    Data Kelas
                  </Form.Label>

                  <Form.Select
                    value={kelasId}
                    onChange={handleKelasChange}
                    disabled={kelasLoading}
                    style={inputStyle}
                  >
                    <option value="">
                      {kelasLoading
                        ? "Memuat data kelas..."
                        : "Pilih data kelas (opsional)"}
                    </option>

                    {kelasList.map((item) => (
                      <option key={item.id_kelas} value={item.id_kelas}>
                        {item.nama} - {item.email}
                      </option>
                    ))}
                  </Form.Select>

                  <div
                    style={{
                      color: "#64748B",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    Pilih data kelas untuk mengisi Nama, No. Handphone, Email,
                    dan Role secara otomatis.
                  </div>
                </Form.Group>

                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Title
                  </Form.Label>

                  <div className="d-flex gap-4 mt-2">
                    <Form.Check
                      inline
                      type="radio"
                      label="Tuan"
                      checked={title === "Tuan"}
                      onChange={() => setTitle("Tuan")}
                    />

                    <Form.Check
                      inline
                      type="radio"
                      label="Nyonya"
                      checked={title === "Nyonya"}
                      onChange={() => setTitle("Nyonya")}
                    />

                    <Form.Check
                      inline
                      type="radio"
                      label="Nona"
                      checked={title === "Nona"}
                      onChange={() => setTitle("Nona")}
                    />
                  </div>
                </Form.Group>

                {/* Nama */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                      color: "#343A40",
                    }}
                  >
                    Nama Lengkap
                  </Form.Label>

                  <div style={{ position: "relative" }}>
                    <Form.Control
                      placeholder="Masukkan Nama Lengkap"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      style={inputStyle}
                    />

                    {nama && (
                      <FaTimes
                        onClick={() => setNama("")}
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#B6B6B6",
                        }}
                      />
                    )}
                  </div>

                  {namaError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {namaError}
                    </div>
                  )}
                </Form.Group>

                {/* No. Handphone */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#344054",
                      marginBottom: "8px",
                    }}
                  >
                    No. Handphone
                  </Form.Label>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    {/* Kode Negara */}
                    <div
                      style={{
                        width: "98px",
                        height: "52px",
                        borderRadius: "12px",
                        background: "#F6F8FC",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#667085",
                          fontWeight: 500,
                          marginBottom: "4px",
                        }}
                      >
                        Kode Negara
                      </span>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <img
                          src={IndonesiaFlag}
                          alt="Indonesia"
                          style={{
                            width: "30px",
                            height: "20px",
                            objectFit: "cover",
                            borderRadius: "2px",
                            display: "block",
                            boxShadow: "0 1px 2px rgba(0,0,0,.08)",
                          }}
                        />

                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#344054",
                          }}
                        >
                          +62
                        </span>
                      </div>
                    </div>

                    {/* Input */}
                    <input
                      type="tel"
                      placeholder="Cth : 812-xxxx-xxxx"
                      value={phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");

                        if (value.startsWith("0")) {
                          value = value.substring(1);
                        }

                        setPhone(value);
                      }}
                      style={{
                        flex: 1,
                        height: "52px",
                        border: "1px solid #D0D5DD",
                        borderRadius: "12px",
                        padding: "0 24px",
                        fontSize: "14px",
                        color: "#344054",
                        outline: "none",
                        background: "#FFFFFF",
                      }}
                    />
                  </div>

                  {phoneError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {phoneError}
                    </div>
                  )}
                </Form.Group>


                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Email
                  </Form.Label>

                  <div style={{ position: "relative" }}>
                    <Form.Control
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan Email"
                      style={inputStyle}
                    />

                    {email && (
                      <FaTimes
                        onClick={() => setEmail("")}
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#A0A0A0",
                        }}
                      />
                    )}
                  </div>

                  {emailError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: 12,
                        marginTop: 5,
                      }}
                    >
                      {emailError}
                    </div>
                  )}
                </Form.Group>

                {/* Tanggal Lahir */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Tanggal Lahir
                  </Form.Label>

                  <div style={{ position: "relative", width: "100%" }}>
                    <DatePicker
                      selected={tanggal}
                      onChange={(date) => setTanggal(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="dd/mm/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className="tanggal-input"
                    />

                    <FaCalendarAlt
                      style={{
                        position: "absolute",
                        right: "18px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#8B95A5",
                        fontSize: "18px",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {tanggalError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {tanggalError}
                    </div>
                  )}
                </Form.Group>

                {/* Roles - diambil dari backend (/api/roles), hanya Admin & Member */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Roles
                  </Form.Label>

                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={rolesLoading}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                    }}
                  >
                    <option value="" disabled hidden>
                      {rolesLoading ? "Memuat role..." : "Pilih Role"}
                    </option>

                    {roles.map((r) => (
                      <option key={r.id_role} value={r.id_role}>
                        {r.nama_role}
                      </option>
                    ))}
                  </Form.Select>

                  {roleError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {roleError}
                    </div>
                  )}
                </Form.Group>

                {/* Status */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    Status
                  </Form.Label>

                  <Form.Select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);

                      // ketika kembali Active, kosongkan alasan
                      if (e.target.value === "Active") {
                        setAlasanNonActive("");
                        setAlasanError("");
                      }
                    }}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      border: "1px solid #D9DDE7",
                      boxShadow: "none",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Non Active">Non Active</option>
                  </Form.Select>
                </Form.Group>

                {/* Alasan Non Active - hanya muncul jika status Non Active */}
                {status === "Non Active" && (
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}
                    >
                      Alasan Non Active
                    </Form.Label>

                    <div style={{ position: "relative" }}>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={300}
                        placeholder="Masukkan Alasan Non Active"
                        value={alasanNonActive}
                        onChange={(e) => {
                          setAlasanNonActive(e.target.value);
                          setAlasanError("");
                        }}
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          padding: "12px 36px 12px 14px",
                          borderRadius: "12px",
                          border: alasanError
                            ? "1px solid #E53935"
                            : "1px solid #D9DDE7",
                          boxShadow: "none",
                          resize: "none",
                        }}
                      />

                      {alasanNonActive && (
                        <FaTimes
                          onClick={() => {
                            setAlasanNonActive("");
                            setAlasanError("");
                          }}
                          style={{
                            position: "absolute",
                            right: "15px",
                            top: "14px",
                            cursor: "pointer",
                            color: "#B6B6B6",
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "6px",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ color: "#667085" }}>
                        Masukkan alasan mengapa user dinonaktifkan.
                      </span>

                      <span style={{ color: "#98A2B3" }}>
                        {alasanNonActive.length}/300
                      </span>
                    </div>

                    {alasanError && (
                      <div
                        style={{
                          color: "#E53935",
                          fontSize: "12px",
                          marginTop: "6px",
                          fontWeight: "500",
                        }}
                      >
                        {alasanError}
                      </div>
                    )}
                  </Form.Group>
                )}

                <div
                  style={{
                    height: "10px",
                    background: "#FAFAFA",
                    margin: "18px -24px",
                    borderTop: "1px solid #F0F0F0",
                    borderBottom: "1px solid #F0F0F0",
                  }}
                />

                {/* Kata Sandi - section collapsible */}
                <div
                  onClick={() => setResetPassword(!resetPassword)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#31353F",
                    }}
                  >
                    Kata Sandi
                  </span>

                  {resetPassword ? (
                    <FaChevronUp color="#8B95A5" />
                  ) : (
                    <FaChevronDown color="#8B95A5" />
                  )}
                </div>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Reset Kata Sandi"
                    checked={resetPassword}
                    onChange={(e) => setResetPassword(e.target.checked)}
                  />
                </Form.Group>

                {resetPassword && (
                  <>
                    {/* Kata Sandi Baru */}
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          marginBottom: "6px",
                        }}
                      >
                        Kata Sandi Baru
                      </Form.Label>

                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan Kata Sandi Baru"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={inputStyle}
                        />

                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "15px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#64748B",
                          }}
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                      </div>

                      {passwordError && (
                        <div
                          style={{
                            color: "#E53935",
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {passwordError}
                        </div>
                      )}
                    </Form.Group>

                    {/* Konfirmasi Kata Sandi Baru */}
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          marginBottom: "6px",
                        }}
                      >
                        Konfirmasi Kata Sandi Baru
                      </Form.Label>

                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type={showConfirm ? "text" : "password"}
                          placeholder="Masukkan Ulang Kata Sandi Baru"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={inputStyle}
                        />

                        <div
                          onClick={() => setShowConfirm(!showConfirm)}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "15px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#64748B",
                          }}
                        >
                          {showConfirm ? <FaEye /> : <FaEyeSlash />}
                        </div>
                      </div>

                      {confirmError && (
                        <div
                          style={{
                            color: "#E53935",
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {confirmError}
                        </div>
                      )}
                    </Form.Group>
                  </>
                )}

                {/* Tombol Aksi */}
                <div className="d-flex gap-3 mt-4">
                  <Button
                    type="button"
                    disabled={saving}
                    onMouseEnter={() => setCancelHover(true)}
                    onMouseLeave={() => {
                      setCancelHover(false);
                      setCancelPressed(false);
                    }}
                    onMouseDown={() => setCancelPressed(true)}
                    onMouseUp={() => setCancelPressed(false)}
                    onClick={() => {
                      setAlertType("warning");
                      setAlertTitle("Perubahan dibatalkan");
                      setAlertDescription(
                        "Data yang belum disimpan tidak akan tersimpan."
                      );
                      setShowToast(true);

                      setTimeout(() => {
                        setShowToast(false);
                        navigate("/user-management");
                      }, 2000);
                    }}
                    style={{
                      flex: 1,
                      height: "56px",
                      borderRadius: "14px",
                      border: "1px solid #CBD5E1",
                      background: cancelHover ? "#EEF2F7" : "#F8FAFC",
                      color: "#475569",
                      fontWeight: 700,
                      fontSize: "16px",
                      transition: "all .25s ease",
                      transform: cancelPressed
                        ? "scale(.96)"
                        : cancelHover
                        ? "translateY(-2px)"
                        : "scale(1)",
                      boxShadow: cancelHover
                        ? "0 10px 24px rgba(0,0,0,.08)"
                        : "0 2px 6px rgba(0,0,0,.05)",
                    }}
                  >
                    BATAL
                  </Button>

                  <Button
                    type="submit"
                    disabled={!isFormValid || saving}
                    onMouseEnter={() => setSaveHover(true)}
                    onMouseLeave={() => {
                      setSaveHover(false);
                      setIsPressed(false);
                    }}
                    onMouseDown={() => setIsPressed(true)}
                    onMouseUp={() => setIsPressed(false)}
                    style={{
                      flex: 1,
                      height: "56px",
                      borderRadius: "18px",
                      border: "none",
                      backgroundColor: isFormValid ? "#2438C8" : "#C8D0F5",
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: "16px",
                      cursor: isFormValid && !saving ? "pointer" : "not-allowed",
                      transition:
                        "transform .18s ease, box-shadow .25s ease, background .25s ease",

                      transform: isPressed
                        ? "scale(.96)"
                        : saveHover
                        ? "translateY(-2px)"
                        : "scale(1)",

                      boxShadow:
                        saveHover && isFormValid
                          ? "0 14px 30px rgba(36,56,200,.35)"
                          : isFormValid
                          ? "0 8px 20px rgba(36,56,200,.25)"
                          : "none",
                      opacity: isFormValid ? 1 : 0.7,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {saving && (
                      <Spinner
                        animation="border"
                        size="sm"
                        style={{ color: "#FFF" }}
                      />
                    )}
                    {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditUser;