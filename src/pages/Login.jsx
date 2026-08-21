import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useState } from "react";
import api from "../api";

import {
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

import Swal from "sweetalert2";

// Hanya role Admin yang boleh masuk ke halaman User Management.
const ALLOWED_ROLE = "admin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "Ups, login gagal! Masukkan email & password yang benar!"
  );

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isFormValid =
    email.trim().length > 0 &&
    password.trim().length > 0;

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    let valid = true;

    if (email.trim() === "") {
      setEmailError("Masukkan email yang valid");
      valid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Masukkan password yang valid");
      valid = false;
    }

    if (!valid) {
      triggerToast(
        "Ups, login gagal! Masukkan email & password yang benar!"
      );
      return;
    }

    try {
      const response = await api.post("/api/login", {
        email: email.trim(),
        password: password,
      });

      if (response.data.status === "success") {
        const user = response.data.data;
        const role = (user?.role || "").toLowerCase().trim();

        // =========================================================
        // ADMIN
        // =========================================================
        if (role === ALLOWED_ROLE) {
          localStorage.setItem("user", JSON.stringify(user));

          await Swal.fire({
            icon: "success",
            title: "Login Berhasil",
            text: "Selamat Datang",
            timer: 1500,
            showConfirmButton: false,
          });

          window.location.href = "/user-management";
          return;
        }

        // =========================================================
        // MEMBER
        // =========================================================
        localStorage.setItem("user", JSON.stringify(user));

        await Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Selamat Datang",
          timer: 1500,
          showConfirmButton: false,
        });

        window.location.href = "/dashboard";
      } else {
        triggerToast(
          response.data?.message ||
            "Ups, login gagal! Masukkan email & password yang benar!"
        );
      }
    } catch (error) {
      console.error("Login gagal:", error);

      const message =
        error.response?.data?.message ||
        "Ups, login gagal! Masukkan email & password yang benar!";

      triggerToast(message);
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
        {/* RIGHT SIDE */}
        <Col
          xs={11}
          sm={9}
          md={6}
          lg={4}
          className="d-flex justify-content-center"
        >
          {showToast && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#FDECEC",
                border: "1px solid #F5C2C7",
                color: "#D93025",
                borderRadius: "10px",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 6px 18px rgba(0,0,0,.12)",
                zIndex: 9999,
                minWidth: "430px",
                maxWidth: "90vw",
              }}
            >
              <FaExclamationTriangle
                style={{
                  color: "#D93025",
                  fontSize: "15px",
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {toastMessage}
              </span>

              <FaTimes
                onClick={() => setShowToast(false)}
                style={{
                  cursor: "pointer",
                  color: "#D93025",
                  fontSize: "13px",
                  flexShrink: 0,
                }}
              />
            </div>
          )}

          {/* LOGIN FORM */}
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
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2
                className="text-center fw-bold"
                style={{
                  fontSize: "34px",
                  color: "#31353F",
                }}
              >
                Hai, Selamat Datang Kembali!
              </h2>

              <p
                className="text-center mb-5"
                style={{
                  color: "#8B8E99",
                  fontSize: "14px",
                }}
              >
                Nikmati kemudahan manajemen data dan fitur HiColleagues
              </p>

              <Form onSubmit={handleLogin}>
                {/* EMAIL */}
                <Form.Group className="mb-4">
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#31353F",
                      marginBottom: "8px",
                    }}
                  >
                    Email
                  </Form.Label>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <Form.Control
                      type="text"
                      autoComplete="username"
                      placeholder="Masukkan email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                    {email.trim() !== "" && (
                      <FaTimes
                        onClick={() => {
                          setEmail("");
                        }}
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#A7AFBD",
                          zIndex: 2,
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
                  <Form.Label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#31353F",
                      marginBottom: "8px",
                    }}
                  >
                    Kata Sandi
                  </Form.Label>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      style={{
                        height: "58px",
                        border: "1px solid #E4E7EC",
                        background: "#FFFFFF",
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
                        fontSize: "15px",
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

                <div className="text-end mb-3">
                  <p
                    style={{
                      textAlign: "right",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#5A5F73",
                      cursor: "pointer",
                    }}
                  >
                    Lupa Sandi?
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-100 fw-bold"
                  style={{
                    height: "55px",
                    borderRadius: "14px",
                    border: "none",
                    fontSize: "18px",
                    fontWeight: "700",
                    background: isFormValid
                      ? "#2D3ECF"
                      : "#B7BCD3",
                    cursor: "pointer",
                  }}
                >
                  MASUK
                </Button>

                {/* REGISTER */}
                <div
                  className="text-center mt-3"
                  style={{
                    fontSize: "14px",
                    color: "#777",
                  }}
                >
                  Belum punya akun?{" "}
                  <span
                    onClick={() => {
                      window.location.href = "/register";
                    }}
                    style={{
                      color: "#2D3ECF",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Daftar sekarang
                  </span>
                </div>

                <p
                  className="text-center mt-4"
                  style={{
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  Dengan masuk ke dalam akun, kamu menyetujui{" "}
                  <span
                    style={{
                      color: "#2344c8",
                      fontWeight: "600",
                    }}
                  >
                    Syarat & Ketentuan
                  </span>{" "}
                  serta{" "}
                  <span
                    style={{
                      color: "#2344c8",
                      fontWeight: "600",
                    }}
                  >
                    Kebijakan Privasi
                  </span>
                </p>

                <div
                  className="mt-auto text-center"
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

export default Login;