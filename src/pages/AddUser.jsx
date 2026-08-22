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
  FaEyeSlash
} from "react-icons/fa";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { format } from "date-fns";

import { useNavigate } from "react-router-dom";

import IndonesiaFlag from "../assets/id.svg";

// sesuaikan path ini dengan lokasi api.js kamu
import api from "../api";

function AddUser() {

  // Loading
  const [loading, setLoading] = useState(false);

  // alertMessage
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  // animate button
  const [cancelPressed, setCancelPressed] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const [saveHover, setSaveHover] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const [alertType, setAlertType] = useState("error");

  const navigate = useNavigate();

  // style input
  const inputStyle = {
    height: "48px",
    fontSize: "15px",
    fontWeight: "500",
    paddingLeft: "14px",
    borderRadius: "12px",
    border: "1px solid #D9DDE7",
    boxShadow: "none",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [nama, setNama] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tanggal, setTanggal] = useState(null);
  const [role, setRole] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showToast, setShowToast] = useState(false);

  const [namaError, setNamaError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [tanggalError, setTanggalError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // daftar role diambil dari backend (/api/roles)
  // Catatan: isi role (Admin / Member) dikontrol di tabel `role` pada
  // database, bukan di frontend. Frontend hanya menampilkan apa pun
  // yang dikembalikan backend.
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Data anggota kelas diambil dari backend dan dipakai sebagai
  // dropdown sumber Nama / No. Handphone / Email / Role.
  const [kelasList, setKelasList] = useState([]);
  const [kelasLoading, setKelasLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const getList = (res, key) => {
      const body = res?.data;
      if (Array.isArray(body)) return body;
      if (Array.isArray(body?.data)) return body.data;
      if (Array.isArray(body?.[key])) return body[key];
      return [];
    };

    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const res = await api.get("/api/roles");
        if (!cancelled) {
          setRoles(getList(res, "roles"));
        }
      } catch (err) {
        console.error("Gagal mengambil data role:", err);
        if (!cancelled) setRoles([]);
      } finally {
        if (!cancelled) setRolesLoading(false);
      }
    };

    const fetchKelas = async () => {
      try {
        setKelasLoading(true);
        const res = await api.get("/api/kelas");

        const list = getList(res, "kelas").filter(
          (item) =>
            String(item.status ?? "active").toLowerCase().trim() === "active"
        );

        if (!cancelled) setKelasList(list);
      } catch (err) {
        console.error("Gagal mengambil data kelas:", err);
        console.error("Detail error kelas:", err.response?.data || err.message);
        if (!cancelled) setKelasList([]);
      } finally {
        if (!cancelled) setKelasLoading(false);
      }
    };

    fetchRoles();
    fetchKelas();

    const refreshDropdownData = () => {
      fetchRoles();
      fetchKelas();
    };

    window.addEventListener("focus", refreshDropdownData);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshDropdownData);
    };
  }, []);

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
    password !== "" &&
    confirmPassword !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // reset error
    setNamaError("");
    setPhoneError("");
    setEmailError("");
    setTanggalError("");
    setRoleError("");
    setPasswordError("");
    setConfirmError("");

    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // nama
    if (!nama.trim()) {
      setNamaError("Nama lengkap wajib diisi");
      valid = false;
    }

    // phone
    if (!phone.trim()) {
      setPhoneError("Nomor handphone wajib diisi");
      valid = false;
    } else if (phone.replace(/\D/g, "").length < 10) {
      setPhoneError("Minimal terdiri dari 10 angka");
      valid = false;
    }

    // email
    if (!email.trim()) {
      setEmailError("Email wajib diisi");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Masukkan email yang valid");
      valid = false;
    }

    // tanggal
    if (!tanggal) {
      setTanggalError("Tanggal lahir wajib diisi");
      valid = false;
    }

    // role
    if (!role) {
      setRoleError("Pilih role");
      valid = false;
    }

    // password
    if (!password) {
      setPasswordError("Password wajib diisi");
      valid = false;
    } else if (!passRegex.test(password)) {
      setPasswordError(
        "Min 8 karakter, huruf besar kecil, angka & simbol"
      );
      valid = false;
    }

    // konfirmasi
    if (!confirmPassword) {
      setConfirmError("Konfirmasi password wajib diisi");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Kata sandi tidak cocok");
      valid = false;
    }

    // jika gagal validasi frontend
    if (!valid) {
      setAlertType("warning");
      setAlertTitle("Periksa Kembali!");
      setAlertDescription("Pastikan semua field sudah diisi dengan benar.");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        nama: nama.trim(),
        phone,
        email: email.trim().toLowerCase(),
        tanggal_lahir: tanggal ? format(tanggal, "yyyy-MM-dd") : null,
        password,
        role_id: role,
      };

      const res = await api.post("/api/users", payload);

      // Alert Success
      setAlertType("success");
      setAlertTitle("Berhasil!");
      setAlertDescription(
        res.data?.message || "User baru berhasil ditambahkan."
      );
      setShowToast(true);

      // pindah halaman setelah alert selesai
      setTimeout(() => {
        setLoading(false);
        setShowToast(false);
        navigate("/user-management");
      }, 1800);

      // reset form
      setTitle("");
      setNama("");
      setPhone("");
      setEmail("");
      setTanggal(null);
      setRole("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setLoading(false);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      // email sudah terdaftar -> tunjukkan di field email
      if (status === 409) {
        setEmailError(message || "Email sudah terdaftar");
      }

      setAlertType("error");
      setAlertTitle("Gagal Menyimpan");
      setAlertDescription(
        message || "Terjadi kesalahan pada server. Silakan coba lagi."
      );
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

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

          {/* Toast Alert */}
          {showToast && (
            <div
              style={{
                width: "100%",
                minHeight: "78px",
                marginBottom: "24px",
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
                style={{
                  flexShrink: 0,
                  fontSize: "18px",
                  marginTop: "2px",
                }}
              />

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    marginBottom: "4px",
                    color:
                      alertType === "success"
                        ? "#166534"
                        : alertType === "warning"
                        ? "#92400E"
                        : "#B42318",
                  }}
                >
                  {alertTitle}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#475467",
                  }}
                >
                  {alertDescription}
                </div>
              </div>

              <FaTimes
                onClick={() => setShowToast(false)}
                style={{
                  cursor: "pointer",
                  color: "#98A2B3",
                  flexShrink: 0,
                }}
              />
            </div>
          )}

          <Card
            style={{
              marginTop: "8px",
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
                Buat User
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
                  <Form.Label>Title</Form.Label>

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
                      fontSize: "12px",
                      fontWeight: "600",
                      marginBottom: "6px",
                      color: "#343A40"
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

                {/* Roles */}
                <Form.Group className="mb-4">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      marginBottom: "8px",
                      color: "#1E293B",
                    }}
                  >
                    Roles
                  </Form.Label>

                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={rolesLoading}
                    style={{
                      height: "50px",
                      borderRadius: "12px",
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#1E293B",
                    }}
                  >
                    <option value="" disabled hidden>
                      {rolesLoading ? "Memuat role..." : "Pilih Role"}
                    </option>

                    {roles.map((r) => (
                      <option
                        key={r.id_role}
                        value={r.id_role}
                        style={{ fontSize: "15px", fontWeight: "600" }}
                      >
                        {r.nama_role}
                      </option>
                    ))}
                  </Form.Select>

                  {roleError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: "12px",
                        marginTop: "5px"
                      }}
                    >
                      {roleError}
                    </div>
                  )}
                </Form.Group>

                <div
                  style={{
                    height: "10px",
                    background: "#FAFAFA",
                    margin: "18px -24px",
                    borderTop: "1px solid #F0F0F0",
                    borderBottom: "1px solid #F0F0F0"
                  }}
                />

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>

                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan Password"
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

                {/* Konfirmasi */}
                <Form.Group className="mb-3">
                  <Form.Label>Konfirmasi Password</Form.Label>

                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={showConfirm ? "text" : "password"}
                      placeholder="Konfirmasi Password"
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

                <div className="d-flex gap-3 mt-4">
                  <Button
                    type="button"
                    disabled={loading}
                    onMouseEnter={() => setCancelHover(true)}
                    onMouseLeave={() => {
                      setCancelHover(false);
                      setCancelPressed(false);
                    }}
                    onMouseDown={() => setCancelPressed(true)}
                    onMouseUp={() => setCancelPressed(false)}
                    onClick={() => {
                      setAlertType("warning");
                      setAlertTitle("Pembuatan dibatalkan");
                      setAlertDescription(
                        "Data yang belum disimpan tidak akan tersimpan."
                      );

                      setShowToast(true);

                      setTimeout(() => {
                        setShowToast(false);
                        navigate("/user-management");
                      }, 1800);
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
                    disabled={!isFormValid || loading}
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
                      background: isFormValid
                        ? "linear-gradient(135deg,#3155FF,#2438C8)"
                        : "#C8D0F5",
                      color: "#FFF",
                      fontWeight: 700,
                      fontSize: "16px",
                      cursor: isFormValid && !loading ? "pointer" : "not-allowed",

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

                      opacity: isFormValid ? 1 : .65,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {loading && (
                      <Spinner
                        animation="border"
                        size="sm"
                        style={{ color: "#FFF" }}
                      />
                    )}
                    {loading ? "MENYIMPAN..." : "SIMPAN DATA"}
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

export default AddUser;