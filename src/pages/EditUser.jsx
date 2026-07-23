import { useState, useEffect } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
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

  const [isPressed, setIsPressed] = useState(false);

  // toast (untuk sukses / batal)
  const [showToast, setShowToast] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  // banner error di atas card (sesuai figma "Ups, Data User gagal diperbarui")
  const [showBanner, setShowBanner] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [nama, setNama] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tanggal, setTanggal] = useState(null);
  const [role, setRole] = useState("");

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

  // ambil data user existing dari localStorage berdasarkan id di url
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("users")) || [];
    
    const found = existing.find((u) => String(u.id) === String(id));
    
console.log("ID URL:", id);
console.log("Existing:", existing);
console.log("Found:", found);
console.log("ID dari URL:", id);
console.log("Data users:", existing);
console.log("Data ditemukan:", found);

    if (found) {
      setTitle(found.title || "");
      setNama(found.nama || "");
      setPhone(found.phone || "");
      setEmail(found.email || "");
      setRole(found.role || "");
      setStatus(found.status || "Active");
      setAlasanNonActive(found.alasanNonActive || "");

      if (found.tanggal) {
  if (found.tanggal.includes("/")) {
    setTanggal(parse(found.tanggal, "dd/MM/yyyy", new Date()));
  } else {
    setTanggal(new Date(found.tanggal));
  }
}
    }
  }, [id]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowBanner(false);

    // reset error
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
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

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

    // alasan non active
    if (status === "Non Active" && !alasanNonActive.trim()) {
      setAlasanError("Alasan non active wajib diisi");
      valid = false;
    }

    // password (hanya divalidasi kalau reset password dicentang)
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

    // jika gagal -> tampilkan banner merah persis seperti di figma
    if (!valid) {
      setShowBanner(true);
      return;
    }

    // update ke localStorage
    const existing = JSON.parse(localStorage.getItem("users")) || [];
    const updated = existing.map((u) => {
      if (String(u.id) === String(id)) {
        return {
          ...u,
          title,
          nama,
          phone,
          email,
          tanggal: format(tanggal, "dd/MM/yyyy"),
          role,
          status,
          alasanNonActive: status === "Non Active" ? alasanNonActive : "",
          ...(resetPassword ? { password } : {}),
        };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updated));

    setAlertType("success");
    setAlertTitle("Berhasil!");
    setAlertDescription("Data user berhasil diperbarui.");
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      navigate("/user-management");
    }, 2000);
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
      {/* Toast Alert (sukses / batal) */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
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
                : "1px solid #FFD4D4",
            color:
              alertType === "success"
                ? "#027A48"
                : alertType === "warning"
                ? "#B45309"
                : "#D93025",
            borderRadius: "12px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 9999,
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

      <Row className="justify-content-center">
        <Col xs={11} sm={9} md={7} lg={4} xl={4}>
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
                <strong>Ups, Data User gagal diperbarui.</strong> Pastikan
                memasukkan data yang benar. Coba lagi!
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
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    No. Handphone
                  </Form.Label>

                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        background: "#fff",
                        border: "1px solid #D9DDE7",
                        borderRadius: "12px 0 0 12px",
                        minWidth: "90px",
                        justifyContent: "center",
                        fontWeight: "500",
                      }}
                    >
                      🇮🇩 +62
                    </InputGroup.Text>

                    <div style={{ position: "relative", flex: 1 }}>
                      <Form.Control
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Masukkan Nomor"
                        style={{
                          height: "48px",
                          borderRadius: "0 12px 12px 0",
                          border: "1px solid #D9DDE7",
                          borderLeft: "0",
                          boxShadow: "none",
                          width: "100%",
                        }}
                      />

                      {phone && (
                        <FaTimes
                          onClick={() => setPhone("")}
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
                  </InputGroup>

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
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                    }}
                  >
                    <option value="">Pilih Role</option>
                    <option>Admin</option>
                    <option>Member</option>
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

                {/* Alasan Non Active - hanya muncul jika status user Non Active */}
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
                        onChange={(e) => setAlasanNonActive(e.target.value)}
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          padding: "12px 36px 12px 14px",
                          borderRadius: "12px",
                          border: "1px solid #D9DDE7",
                          boxShadow: "none",
                          resize: "none",
                        }}
                      />

                      {alasanNonActive && (
                        <FaTimes
                          onClick={() => setAlasanNonActive("")}
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
                        textAlign: "right",
                        fontSize: "12px",
                        color: "#9AA1AC",
                        marginTop: "4px",
                      }}
                    >
                      {alasanNonActive.length}/300
                    </div>

                    {alasanError && (
                      <div
                        style={{
                          color: "#E53935",
                          fontSize: "12px",
                          marginTop: "-10px",
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
                      background: "#F8FAFC",
                      color: "#475569",
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    BATAL
                  </Button>

                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    onMouseDown={() => setIsPressed(true)}
                    onMouseUp={() => setIsPressed(false)}
                    onMouseLeave={() => setIsPressed(false)}
                    style={{
                      flex: 1,
                      height: "56px",
                      borderRadius: "18px",
                      border: "none",
                      backgroundColor: isFormValid ? "#2438C8" : "#C8D0F5",
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: "16px",
                      cursor: isFormValid ? "pointer" : "not-allowed",
                      transition: "all .2s ease",
                      transform: isPressed ? "scale(0.97)" : "scale(1)",
                      boxShadow: isFormValid
                        ? "0 8px 20px rgba(36,56,200,.30)"
                        : "none",
                      opacity: isFormValid ? 1 : 0.7,
                    }}
                  >
                    SIMPAN PERUBAHAN
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
