import { useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from "react-bootstrap";

import {
  FaTimes,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import Swal from "sweetalert2";


import "react-phone-input-2/lib/style.css";

function AddUser() {

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
  const [tanggal, setTanggal] = useState("");
  const [role, setRole] = useState("");
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

   // tombol aktif / nonaktif
  const isFormValid =
    title &&
    nama &&
    phone &&
    email &&
    tanggal &&
    role &&
    password &&
    confirmPassword;

  const handleSubmit = (e) => {
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

    // jika gagal
    if (!valid) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // simpan ke localStorage
    const newUser = {
      id: Date.now(),
      title,
      nama,
      phone: `(+62) ${phone}`,
      email,
      tanggal,
      role,
      status: "Active",
    };

    const existing = JSON.parse(localStorage.getItem("users")) || [];
    existing.push(newUser);
    localStorage.setItem("users", JSON.stringify(existing));

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "User berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
    });

    // reset form
    setTitle("");
    setNama("");
    setPhone("");
    setEmail("");
    setTanggal("");
    setRole("");
    setPassword("");
    setConfirmPassword("");
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
      {/* Toast Alert */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#FFF2F2",
            border: "1px solid #FFD4D4",
            color: "#D93025",
            borderRadius: "12px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 9999,
            boxShadow: "0 8px 18px rgba(0,0,0,.08)",
          }}
        >
          <FaExclamationTriangle />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>
              Ups, aktivitas Buat User Baru gagal.
            </div>
            <div style={{ fontSize: 12, color: "#777" }}>
              Pastikan seluruh data sudah benar.
            </div>
          </div>

        <FaTimes
            style={{
              marginLeft: 10,
              cursor: "pointer",
              color: "#999",
            }}
            onClick={() => setShowToast(false)}
          />
        </div>
      )}

    <Row className="justify-content-center">
        <Col xs={11} sm={9} md={7} lg={4} xl={4}>
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
                Buat User
              </h3>

            <Form onSubmit={handleSubmit}>
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

fontSize:"12px",

fontWeight:"600",

marginBottom:"6px",

color:"#343A40"

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
      fontSize: "12px",
      fontWeight: "600",
      marginBottom: "6px",
      color: "#343A40",
    }}
  >
    No. Handphone
  </Form.Label>

  <div style={{ position: "relative" }}>
    <Form.Control
      type="tel"
      placeholder="Contoh: 0812 3456 7890"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      style={inputStyle}
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
          fontSize: "14px",
        }}
      />
    )}
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
              {/* Tanggal */}

              <Form.Group className="mb-2">
                <Form.Label>Tanggal Lahir</Form.Label>

                <div style={{ position:"relative" }}>

<Form.Control

type="date"

value={tanggal}

onChange={(e)=>setTanggal(e.target.value)}

style={inputStyle}

/>

<FaCalendarAlt

style={{

position:"absolute",

right:"15px",

top:"50%",

transform:"translateY(-50%)",

color:"#8A8A8A"

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
                <Form.Label>Roles</Form.Label>

               <Form.Select

value={role}

onChange={(e)=>setRole(e.target.value)}

style={{

height:"48px",

borderRadius:"12px"

}}

>

<option value="">Pilih Role</option>

<option>Admin</option>

<option>Member</option>

</Form.Select>

{roleError&&(

<div
style={{
color:"#E53935",
fontSize:"12px",
marginTop:"5px"
}}
>

{roleError}

</div>

)}
              </Form.Group>

              <div

style={{

height:"10px",

background:"#FAFAFA",

margin:"18px -24px",

borderTop:"1px solid #F0F0F0",

borderBottom:"1px solid #F0F0F0"

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

             <div className="text-center mt-4">
                  <Button
type="submit"
style={{
width:"100%",
height:"54px",
fontSize:"16px",
fontWeight:"700",
borderRadius:"14px",
background:isFormValid?"#2342C0":"#C7CCDE",
border:"none"
}}
>
SIMPAN DATA
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