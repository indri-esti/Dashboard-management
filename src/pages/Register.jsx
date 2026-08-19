import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../api";

function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [namaError, setNamaError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const isFormValid =
    nama.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  const handleRegister = async (e) => {
    e.preventDefault();

    setNamaError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let valid = true;

    if (nama.trim() === "") {
      setNamaError("Nama wajib diisi");
      valid = false;
    }

    if (email.trim() === "") {
      setEmailError("Email wajib diisi");
      valid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password wajib diisi");
      valid = false;
    }

    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Konfirmasi password wajib diisi");
      valid = false;
    }

    if (
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password !== confirmPassword
    ) {
      setConfirmPasswordError("Password tidak sama");
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      const response = await api.post("/api/register", {
        nama: nama.trim(),
        email: email.trim(),
        password: password,
      });

      if (response.data.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil",
          text: "Akun berhasil dibuat. Silakan login.",
          confirmButtonText: "Login",
        });

        window.location.href = "/";
      }
    } catch (error) {
      console.error("Register gagal:", error);

      const message =
        error.response?.data?.message ||
        "Registrasi gagal. Silakan coba lagi.";

      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: message,
      });
    }
  };

  return (
    <Container
      fluid
      style={{
        minHeight: "100vh",
        background: "#EEF3FF",
      }}
    >
      <Row
        className="justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
        }}
      >
        <Col
          xs={11}
          sm={9}
          md={6}
          lg={4}
          className="d-flex justify-content-center"
        >
          <Card
            className="border-0"
            style={{
              width: "100%",
              maxWidth: "470px",
              borderRadius: "32px",
              padding: "15px",
              boxShadow: "0 15px 40px rgba(0,0,0,.08)",
            }}
          >
            <Card.Body
              style={{
                padding: "50px",
              }}
            >
              <h2
                className="text-center fw-bold"
                style={{
                  fontSize: "34px",
                  color: "#31353F",
                }}
              >
                Buat Akun
              </h2>

              <p
                className="text-center mb-5"
                style={{
                  color: "#8B8E99",
                  fontSize: "14px",
                }}
              >
                Daftar untuk menggunakan HiColleagues
              </p>

              <Form onSubmit={handleRegister}>
                {/* NAMA */}
                <Form.Group className="mb-4">
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="Nama"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      autoComplete="name"
                      style={{
                        height: "58px",
                        background: "#F6F8FC",
                        border: "1px solid #E5E7EB",
                        borderRadius: "14px",
                        paddingLeft: "18px",
                        paddingRight: "42px",
                        fontSize: "15px",
                        boxShadow: "none",
                      }}
                    />

                    {nama !== "" && (
                      <FaTimes
                        onClick={() => setNama("")}
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#A7AFBD",
                        }}
                      />
                    )}
                  </div>

                  {namaError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: "12px",
                        marginTop: "6px",
                      }}
                    >
                      {namaError}
                    </div>
                  )}
                </Form.Group>

                {/* EMAIL */}
                <Form.Group className="mb-4">
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      style={{
                        height: "58px",
                        background: "#F6F8FC",
                        border: "1px solid #E5E7EB",
                        borderRadius: "14px",
                        paddingLeft: "18px",
                        paddingRight: "42px",
                        fontSize: "15px",
                        boxShadow: "none",
                      }}
                    />

                    {email !== "" && (
                      <FaTimes
                        onClick={() => setEmail("")}
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#A7AFBD",
                        }}
                      />
                    )}
                  </div>

                  {emailError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: "12px",
                        marginTop: "6px",
                      }}
                    >
                      {emailError}
                    </div>
                  )}
                </Form.Group>

                {/* PASSWORD */}
                <Form.Group className="mb-4">
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Kata Sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      style={{
                        height: "58px",
                        background: "#FFFFFF",
                        border: "1px solid #E4E7EC",
                        borderRadius: "14px",
                        paddingLeft: "18px",
                        paddingRight: "45px",
                        fontSize: "15px",
                      }}
                    />

                    <div
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#666",
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
                        marginTop: "6px",
                      }}
                    >
                      {passwordError}
                    </div>
                  )}
                </Form.Group>

                {/* CONFIRM PASSWORD */}
                <Form.Group className="mb-4">
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Konfirmasi Kata Sandi"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      autoComplete="new-password"
                      style={{
                        height: "58px",
                        background: "#FFFFFF",
                        border: "1px solid #E4E7EC",
                        borderRadius: "14px",
                        paddingLeft: "18px",
                        paddingRight: "45px",
                        fontSize: "15px",
                      }}
                    />

                    <div
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#666",
                      }}
                    >
                      {showConfirmPassword ? (
                        <FaEye />
                      ) : (
                        <FaEyeSlash />
                      )}
                    </div>
                  </div>

                  {confirmPasswordError && (
                    <div
                      style={{
                        color: "#E53935",
                        fontSize: "12px",
                        marginTop: "6px",
                      }}
                    >
                      {confirmPasswordError}
                    </div>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 fw-bold"
                  disabled={!isFormValid}
                  style={{
                    height: "55px",
                    borderRadius: "14px",
                    border: "none",
                    fontSize: "18px",
                    fontWeight: "700",
                    background: isFormValid
                      ? "#2D3ECF"
                      : "#B7BCD3",
                  }}
                >
                  DAFTAR
                </Button>

                <div
                  className="text-center mt-4"
                  style={{
                    fontSize: "14px",
                    color: "#777",
                  }}
                >
                  Sudah punya akun?{" "}
                  <span
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    style={{
                      color: "#2D3ECF",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </span>
                </div>

                <div
                  className="text-center mt-5"
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    borderTop: "1px solid #eee",
                    paddingTop: "18px",
                  }}
                >
                  @Copyright 2026
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;