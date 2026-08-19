import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";

import {
  MdArrowBack,
  MdEdit,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCalendarToday,
  MdPerson,
  MdClose,
  MdCheckCircle,
  MdSave,
} from "react-icons/md";

import api from "../api";

function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadingRef = useRef(false);

  // ---------------------------------------------------------
  // REF UNTUK showModal & saving
  // (dipakai di dalam handleFocus supaya event listener
  // TIDAK perlu dipasang ulang tiap kali showModal/saving
  // berubah -> ini yang mencegah loadProfile() ikut
  // terpanggil ulang saat proses Simpan sedang berjalan,
  // yang sebelumnya menimpa data phone/alamat yang baru
  // disimpan dengan data lama)
  // ---------------------------------------------------------

  const showModalRef = useRef(showModal);
  const savingRef = useRef(saving);

  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);

  useEffect(() => {
    savingRef.current = saving;
  }, [saving]);

  const defaultProfile = {
    account_type: "user",
    id_user: null,
    id_auth: null,
    title: "",
    nama: "",
    email: "",
    phone: "",
    alamat: "",
    role: "Administrator",
    role_id: null,
    tanggal_lahir: "",
    joinDate: "",
    created_at: "",
    foto: "",
    status: "ACTIVE",
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);

  // =========================================================
  // AMBIL USER YANG SEDANG LOGIN
  // =========================================================

  const getLoggedUser = () => {
    try {
      const userRaw = localStorage.getItem("user");

      if (userRaw) {
        const userData = JSON.parse(userRaw);

        if (
          userData &&
          typeof userData === "object"
        ) {
          return userData;
        }
      }

      const profileRaw =
        localStorage.getItem("profileData");

      if (profileRaw) {
        const profileData =
          JSON.parse(profileRaw);

        if (
          profileData &&
          typeof profileData === "object"
        ) {
          return profileData;
        }
      }

      return null;
    } catch (error) {
      console.error(
        "Gagal membaca data user:",
        error
      );

      return null;
    }
  };

  // =========================================================
  // AMBIL ID USER
  // =========================================================

  const getIdUser = (data = {}) => {
    const value =
      data?.id_user ??
      data?.idUser ??
      data?.user_id ??
      data?.id ??
      null;

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    const numeric = Number(value);

    return Number.isNaN(numeric)
      ? value
      : numeric;
  };

  // =========================================================
  // AMBIL ID AUTH
  // =========================================================

  const getIdAuth = (data = {}) => {
    return (
      data?.id_auth ??
      data?.idAuth ??
      data?.auth_id ??
      null
    );
  };

  // =========================================================
  // NORMALISASI PROFILE
  // =========================================================

  const normalizeProfile = (
    backendData = {},
    loggedUser = {}
  ) => {
    const idUser =
      getIdUser(backendData) ??
      getIdUser(loggedUser);

    const idAuth =
      getIdAuth(backendData) ??
      getIdAuth(loggedUser);

    const nama =
      backendData.nama ??
      loggedUser?.nama ??
      "";

    const email =
      backendData.email ??
      loggedUser?.email ??
      "";

    const phone =
      backendData.phone ??
      loggedUser?.phone ??
      "";

    const alamat =
      backendData.alamat ??
      loggedUser?.alamat ??
      "";

    const role =
      backendData.role ??
      backendData.nama_role ??
      loggedUser?.role ??
      loggedUser?.nama_role ??
      "Administrator";

    const roleId =
      backendData.role_id ??
      loggedUser?.role_id ??
      null;

    const joinDate =
      backendData.joinDate ??
      backendData.created_at ??
      loggedUser?.joinDate ??
      loggedUser?.created_at ??
      "";

    const createdAt =
      backendData.created_at ??
      loggedUser?.created_at ??
      joinDate ??
      "";

    const tanggalLahir =
      backendData.tanggal_lahir ??
      loggedUser?.tanggal_lahir ??
      "";

    const foto =
      backendData.foto ??
      loggedUser?.foto ??
      "";

    const status =
      backendData.status ??
      loggedUser?.status ??
      "ACTIVE";

    return {
      ...defaultProfile,
      ...backendData,

      account_type:
        backendData.account_type ??
        loggedUser?.account_type ??
        "user",

      id_user: idUser,
      id_auth: idAuth,

      title:
        backendData.title ??
        loggedUser?.title ??
        "",

      nama,
      email,
      phone,
      alamat,

      role,
      role_id: roleId,

      tanggal_lahir: tanggalLahir,

      joinDate,
      created_at: createdAt,

      foto,
      status,
    };
  };

  // =========================================================
  // UPDATE LOCAL STORAGE USER
  // =========================================================

  const updateLocalUser = (
    updatedProfile = {}
  ) => {
    try {
      const oldUserRaw =
        localStorage.getItem("user");

      const oldUser = oldUserRaw
        ? JSON.parse(oldUserRaw)
        : {};

      const resolvedIdUser =
        getIdUser(updatedProfile) ??
        getIdUser(oldUser);

      const resolvedIdAuth =
        getIdAuth(updatedProfile) ??
        getIdAuth(oldUser);

      const updatedUser = {
        ...oldUser,

        account_type:
          updatedProfile.account_type ??
          oldUser.account_type ??
          "user",

        id_user: resolvedIdUser,

        id_auth: resolvedIdAuth,

        title:
          updatedProfile.title ??
          oldUser.title ??
          "",

        nama:
          updatedProfile.nama ??
          oldUser.nama ??
          "",

        email:
          updatedProfile.email ??
          oldUser.email ??
          "",

        phone:
          updatedProfile.phone ??
          oldUser.phone ??
          "",

        alamat:
          updatedProfile.alamat ??
          oldUser.alamat ??
          "",

        role:
          updatedProfile.role ??
          oldUser.role ??
          oldUser.nama_role ??
          "Administrator",

        nama_role:
          updatedProfile.role ??
          oldUser.nama_role ??
          oldUser.role ??
          "Administrator",

        role_id:
          updatedProfile.role_id ??
          oldUser.role_id ??
          null,

        status:
          updatedProfile.status ??
          oldUser.status ??
          "ACTIVE",

        tanggal_lahir:
          updatedProfile.tanggal_lahir ??
          oldUser.tanggal_lahir ??
          "",

        created_at:
          updatedProfile.created_at ??
          oldUser.created_at ??
          "",

        joinDate:
          updatedProfile.joinDate ??
          oldUser.joinDate ??
          updatedProfile.created_at ??
          oldUser.created_at ??
          "",

        foto:
          updatedProfile.foto ??
          oldUser.foto ??
          "",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      console.log(
        "Data user login berhasil diperbarui:",
        updatedUser
      );
    } catch (error) {
      console.error(
        "Gagal memperbarui localStorage user:",
        error
      );
    }
  };

  // =========================================================
  // SIMPAN PROFILE KE LOCAL STORAGE
  // =========================================================

  const saveLocalProfile = (
    updatedProfile
  ) => {
    try {
      localStorage.setItem(
        "profileData",
        JSON.stringify(updatedProfile)
      );

      updateLocalUser(updatedProfile);
    } catch (error) {
      console.error(
        "Gagal menyimpan profile lokal:",
        error
      );
    }
  };

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  const loadProfile = async () => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;

    try {
      setLoading(true);

      const loggedUser =
        getLoggedUser() || {};

      let idUser =
        getIdUser(loggedUser);

      const idAuth =
        getIdAuth(loggedUser);

      let email =
        loggedUser?.email
          ?.toString()
          .trim() || "";

      // -------------------------------------------------------
      // JIKA USER BELUM ADA ID
      // CEK profileData
      // -------------------------------------------------------

      if (
        idUser === null &&
        !idAuth &&
        !email
      ) {
        try {
          const profileRaw =
            localStorage.getItem(
              "profileData"
            );

          if (profileRaw) {
            const storedProfile =
              JSON.parse(profileRaw);

            idUser =
              getIdUser(
                storedProfile
              );

            email =
              storedProfile?.email
                ?.toString()
                .trim() || "";

          }
        } catch (error) {
          console.error(
            "Gagal membaca profileData:",
            error
          );
        }
      }

      const params = {};

      if (
        idUser !== null &&
        idUser !== undefined &&
        idUser !== ""
      ) {
        params.id_user = idUser;
      } else if (
        idAuth !== null &&
        idAuth !== undefined &&
        idAuth !== ""
      ) {
        params.id_auth = idAuth;
      } else if (email) {
        params.email = email;
      }

      // -------------------------------------------------------
      // TIDAK ADA IDENTITAS USER
      // -------------------------------------------------------

      if (
        !params.id_user &&
        !params.id_auth &&
        !params.email
      ) {
        setProfile(defaultProfile);
        setFormData(defaultProfile);
        return;
      }

      console.log(
        "Mengambil profile dengan params:",
        params
      );

      // -------------------------------------------------------
      // GET PROFILE
      // -------------------------------------------------------

      const response = await api.get(
        "/api/profile",
        {
          params,
        }
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {
        const backendData =
          response.data.data;

        const newProfile =
          normalizeProfile(
            backendData,
            loggedUser
          );

        setProfile(newProfile);
        setFormData(newProfile);

        saveLocalProfile(newProfile);

        console.log(
          "Profile berhasil dimuat:",
          newProfile
        );

        return;
      }

      throw new Error(
        response.data?.message ||
          "Profile tidak ditemukan"
      );
    } catch (error) {
      console.error(
        "Gagal mengambil profile:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Tidak dapat mengambil data profile dari server.";

      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Profile",
        text: message,
        confirmButtonColor: "#243BB8",
      });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // =========================================================
  // USE EFFECT
  // ---------------------------------------------------------
  // PERBAIKAN: dependency array dikosongkan ([]) supaya
  // loadProfile() HANYA dipanggil sekali saat komponen
  // pertama kali dimuat, bukan setiap kali showModal/saving
  // berubah. Sebelumnya, effect ini ikut jalan ulang saat
  // handleSave() mengubah "saving", sehingga terjadi request
  // GET yang balapan (race condition) dengan request PUT dan
  // menimpa data phone/alamat yang baru saja tersimpan
  // dengan data lama.
  //
  // Listener "focus" tetap dipasang, tapi pakai ref
  // (showModalRef/savingRef) supaya tidak perlu memasang
  // ulang listener setiap render.
  // =========================================================

  useEffect(() => {
    loadProfile();

    const handleFocus = () => {
      if (
        !showModalRef.current &&
        !savingRef.current
      ) {
        loadProfile();
      }
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  // =========================================================
  // KEMBALI
  // =========================================================

  const handleBack = () => {
    navigate(-1);
  };

  // =========================================================
  // INPUT
  // =========================================================

  const handleChange = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // BUKA MODAL EDIT
  // =========================================================

  const openEditModal = () => {
    const currentProfile =
      normalizeProfile(
        profile,
        getLoggedUser() || {}
      );

    setFormData({
      ...currentProfile,
      id_user:
        currentProfile.id_user,
      id_auth:
        currentProfile.id_auth,
    });

    setShowModal(true);
  };

  // =========================================================
  // TUTUP MODAL
  // =========================================================

  const closeEditModal = () => {
    if (saving) {
      return;
    }

    if (
      document.activeElement &&
      typeof document.activeElement.blur ===
        "function"
    ) {
      document.activeElement.blur();
    }

    setFormData(profile);
    setShowModal(false);
  };

  // =========================================================
  // CARI IDENTITAS USER
  // =========================================================

  const resolveUserIdentity = async () => {
    let idUser =
      getIdUser(formData);

    let idAuth =
      getIdAuth(formData);

    // -------------------------------------------------------
    // PROFILE
    // -------------------------------------------------------

    if (
      idUser === null &&
      !idAuth
    ) {
      idUser =
        getIdUser(profile);

      idAuth =
        getIdAuth(profile);
    }

    // -------------------------------------------------------
    // LOCAL STORAGE
    // -------------------------------------------------------

    if (
      idUser === null &&
      !idAuth
    ) {
      const loggedUser =
        getLoggedUser();

      idUser =
        getIdUser(loggedUser);

      idAuth =
        getIdAuth(loggedUser);
    }

    // -------------------------------------------------------
    // JIKA ID SUDAH ADA
    // -------------------------------------------------------

    if (
      idUser !== null ||
      idAuth
    ) {
      return {
        id_user: idUser,
        id_auth: idAuth,
      };
    }

    // -------------------------------------------------------
    // CARI BERDASARKAN EMAIL
    // -------------------------------------------------------

    const email =
      formData?.email
        ?.trim()
        .toLowerCase() ||
      profile?.email
        ?.trim()
        .toLowerCase() ||
      getLoggedUser()?.email
        ?.trim()
        .toLowerCase() ||
      "";

    if (!email) {
      return {
        id_user: null,
        id_auth: null,
      };
    }

    try {
      const response =
        await api.get(
          "/api/profile",
          {
            params: {
              email,
            },
          }
        );

      if (
        response.data?.success &&
        response.data?.data
      ) {
        const foundProfile =
          normalizeProfile(
            response.data.data,
            getLoggedUser() || {}
          );

        idUser =
          getIdUser(foundProfile);

        idAuth =
          getIdAuth(foundProfile);

        if (
          idUser !== null ||
          idAuth
        ) {
          setProfile(foundProfile);
          setFormData((prev) => ({
            ...prev,
            ...foundProfile,
            id_user: idUser,
            id_auth: idAuth,
          }));

          saveLocalProfile(
            foundProfile
          );

          return {
            id_user: idUser,
            id_auth: idAuth,
          };
        }
      }
    } catch (error) {
      console.error(
        "Gagal mencari profile berdasarkan email:",
        error
      );
    }

    return {
      id_user: null,
      id_auth: null,
    };
  };

  // =========================================================
  // SIMPAN PROFILE
  // =========================================================

  const handleSave = async () => {
    const nama =
      formData.nama?.trim() || "";

    const email =
      formData.email
        ?.trim()
        .toLowerCase() || "";

    const phone =
      formData.phone?.trim() || "";

    const alamat =
      formData.alamat?.trim() || "";

    // -------------------------------------------------------
    // VALIDASI NAMA
    // -------------------------------------------------------

    if (!nama) {
      Swal.fire({
        icon: "warning",
        title: "Nama belum diisi",
        text:
          "Silakan masukkan nama lengkap.",
        confirmButtonColor:
          "#243BB8",
      });

      return;
    }

    // -------------------------------------------------------
    // VALIDASI EMAIL
    // -------------------------------------------------------

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email belum diisi",
        text:
          "Silakan masukkan email.",
        confirmButtonColor:
          "#243BB8",
      });

      return;
    }

    // -------------------------------------------------------
    // VALIDASI FORMAT EMAIL
    // -------------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Email tidak valid",
        text:
          "Silakan masukkan alamat email yang valid.",
        confirmButtonColor:
          "#243BB8",
      });

      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------------------
      // CARI ID / AUTH ID
      // -----------------------------------------------------

      const identity =
        await resolveUserIdentity();

      const idUser =
        identity.id_user;

      const idAuth =
        identity.id_auth;

      if (
        idUser === null &&
        !idAuth
      ) {
        Swal.fire({
          icon: "error",
          title: "Akun Tidak Ditemukan",
          text:
            "Data akun yang sedang login tidak ditemukan. Silakan login kembali.",
          confirmButtonColor:
            "#243BB8",
        });

        return;
      }

      // -----------------------------------------------------
      // PAYLOAD
      // -----------------------------------------------------

      const payload = {
        nama,
        email,
        phone,
        alamat,
      };

      if (
        idUser !== null &&
        idUser !== undefined &&
        idUser !== ""
      ) {
        payload.id_user = idUser;
      }

      if (
        idAuth !== null &&
        idAuth !== undefined &&
        idAuth !== ""
      ) {
        payload.id_auth = idAuth;
      }

      console.log(
        "Payload update profile:",
        payload
      );

      // -----------------------------------------------------
      // UPDATE BACKEND
      // -----------------------------------------------------

      const response =
        await api.put(
          "/api/profile",
          payload
        );

      if (
        !response.data?.success ||
        !response.data?.data
      ) {
        throw new Error(
          response.data?.message ||
            "Gagal memperbarui profile"
        );
      }

      // -----------------------------------------------------
      // DATA DARI BACKEND
      // -----------------------------------------------------

      const backendData =
        response.data.data;

      const updatedProfile =
        normalizeProfile(
          {
            ...profile,
            ...backendData,

            id_user:
              backendData.id_user ??
              idUser,

            id_auth:
              backendData.id_auth ??
              idAuth,

            nama:
              backendData.nama ??
              nama,

            email:
              backendData.email ??
              email,

            phone:
              backendData.phone ??
              phone,

            alamat:
              backendData.alamat ??
              alamat,
          },
          formData
        );

      // -----------------------------------------------------
      // UPDATE STATE
      // -----------------------------------------------------

      setProfile(updatedProfile);
      setFormData(updatedProfile);

      // -----------------------------------------------------
      // UPDATE LOCAL STORAGE
      // -----------------------------------------------------

      saveLocalProfile(
        updatedProfile
      );

      // -----------------------------------------------------
      // BLUR INPUT
      // -----------------------------------------------------

      if (
        document.activeElement &&
        typeof document.activeElement.blur ===
          "function"
      ) {
        document.activeElement.blur();
      }

      // -----------------------------------------------------
      // TUTUP MODAL
      // -----------------------------------------------------

      setShowModal(false);

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text:
            "Profile berhasil diperbarui.",
          confirmButtonColor:
            "#243BB8",
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
      }, 200);
    } catch (error) {
      console.error(
        "Gagal menyimpan profile:",
        error
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Profile gagal diperbarui.";

      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: errorMessage,
        confirmButtonColor:
          "#243BB8",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // FORMAT TANGGAL
  // =========================================================

  const formatTanggal = (
    tanggal
  ) => {
    if (!tanggal) {
      return "-";
    }

    const date =
      new Date(tanggal);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return tanggal;
    }

    return date.toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#EEF3FF,#F8FAFC)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            background: "#fff",
            borderRadius: 24,
            padding:
              "40px 30px",
            textAlign: "center",
            boxShadow:
              "0 20px 50px rgba(15,23,42,.10)",
            border:
              "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius:
                "50%",
              background:
                "#EEF2FF",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              margin:
                "0 auto 22px",
            }}
          >
            <Spinner
              animation="border"
              style={{
                width: 38,
                height: 38,
                color: "#243BB8",
                borderWidth: 4,
              }}
            />
          </div>

          <h4
            style={{
              margin: 0,
              color:
                "#1E293B",
              fontWeight: 700,
            }}
          >
            Memuat Profile
          </h4>

          <p
            style={{
              margin:
                "8px 0 0",
              color:
                "#64748B",
              fontSize: 14,
            }}
          >
            Mengambil data akun...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#F8FAFC 0%,#EEF3FF 100%)",
        padding:
          "30px 24px 45px",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            marginBottom: 22,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                color:
                  "#64748B",
                marginBottom: 4,
              }}
            >
              Akun Saya
            </div>

            <h1
              style={{
                margin: 0,
                color:
                  "#0F172A",
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              Profile
            </h1>
          </div>

          <button
            onClick={
              handleBack
            }
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 7,
              border:
                "1px solid #CBD5E1",
              background:
                "#fff",
              color:
                "#475569",
              borderRadius: 11,
              padding:
                "10px 15px",
              fontWeight: 600,
              cursor:
                "pointer",
              boxShadow:
                "0 5px 15px rgba(15,23,42,.05)",
            }}
          >
            <MdArrowBack
              size={19}
            />
            Kembali
          </button>
        </div>

        {/* HERO PROFILE */}

        <div
          style={{
            position:
              "relative",
            overflow:
              "hidden",
            background:
              "linear-gradient(135deg,#1E2A78 0%,#243BB8 48%,#526DFF 100%)",
            borderRadius: 24,
            padding:
              "32px 34px",
            color: "#fff",
            boxShadow:
              "0 20px 45px rgba(36,59,184,.24)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              position:
                "absolute",
              width: 260,
              height: 260,
              borderRadius:
                "50%",
              background:
                "rgba(255,255,255,.07)",
              right: -100,
              top: -120,
            }}
          />

          <div
            style={{
              position:
                "absolute",
              width: 180,
              height: 180,
              borderRadius:
                "50%",
              background:
                "rgba(255,255,255,.045)",
              left: -90,
              bottom: -110,
            }}
          />

          <div
            style={{
              position:
                "relative",
              display:
                "flex",
              alignItems:
                "center",
              gap: 22,
              flexWrap:
                "wrap",
            }}
          >
            {/* FOTO */}

            <div
              style={{
                width: 105,
                height: 105,
                minWidth: 105,
                borderRadius:
                  "50%",
                background:
                  "linear-gradient(135deg,#fff,#E8EEFF)",
                border:
                  "5px solid rgba(255,255,255,.25)",
                boxShadow:
                  "0 15px 35px rgba(0,0,0,.20)",
                overflow:
                  "hidden",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
              }}
            >
              {profile.foto ? (
                <img
                  src={
                    profile.foto
                  }
                  alt="Foto Profile"
                  style={{
                    width:
                      "100%",
                    height:
                      "100%",
                    objectFit:
                      "cover",
                  }}
                />
              ) : (
                <span
                  style={{
                    color:
                      "#243BB8",
                    fontSize: 42,
                    fontWeight: 800,
                  }}
                >
                  {(
                    profile.nama ||
                    "A"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>

            {/* DATA */}

            <div
              style={{
                flex: 1,
                minWidth: 200,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 29,
                  fontWeight: 800,
                }}
              >
                {profile.nama ||
                  "-"}
              </h2>

              <div
                style={{
                  color:
                    "rgba(255,255,255,.78)",
                  fontSize: 14,
                  margin:
                    "6px 0 13px",
                }}
              >
                {profile.role ||
                  "Administrator"}
              </div>

              <div
                style={{
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: 6,
                  padding:
                    "7px 12px",
                  borderRadius:
                    999,
                  background:
                    "rgba(255,255,255,.12)",
                  border:
                    "1px solid rgba(255,255,255,.15)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <MdCheckCircle
                  size={16}
                />

                {profile.status ||
                  "ACTIVE"}
              </div>
            </div>

            {/* EDIT */}

            <button
              onClick={
                openEditModal
              }
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 8,
                background:
                  "#fff",
                border:
                  "none",
                color:
                  "#243BB8",
                borderRadius:
                  11,
                padding:
                  "11px 16px",
                fontWeight: 700,
                cursor:
                  "pointer",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,.12)",
              }}
            >
              <MdEdit
                size={18}
              />
              Edit Profile
            </button>
          </div>
        </div>

        {/* INFORMASI */}

        <div
          style={{
            background:
              "#fff",
            borderRadius: 22,
            padding: 26,
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 12px 30px rgba(15,23,42,.055)",
          }}
        >
          <div
            style={{
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                margin: 0,
                color:
                  "#0F172A",
                fontSize: 19,
                fontWeight: 750,
              }}
            >
              Informasi Profile
            </h3>

            <p
              style={{
                margin:
                  "5px 0 0",
                color:
                  "#64748B",
                fontSize: 13,
              }}
            >
              Informasi akun pengguna
            </p>
          </div>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            <InfoCard
              icon={
                <MdEmail
                  size={21}
                />
              }
              title="Email"
              value={
                profile.email ||
                "-"
              }
            />

            <InfoCard
              icon={
                <MdPhone
                  size={21}
                />
              }
              title="Nomor Telepon"
              value={
                profile.phone ||
                "-"
              }
            />

            <InfoCard
              icon={
                <MdLocationOn
                  size={21}
                />
              }
              title="Alamat"
              value={
                profile.alamat ||
                "-"
              }
            />

            <InfoCard
              icon={
                <MdCalendarToday
                  size={20}
                />
              }
              title="Bergabung Sejak"
              value={formatTanggal(
                profile.joinDate
              )}
            />

            <InfoCard
              icon={
                <MdPerson
                  size={21}
                />
              }
              title="Role"
              value={
                profile.role ||
                "-"
              }
            />

            <InfoCard
              icon={
                <MdCheckCircle
                  size={21}
                />
              }
              title="Status Akun"
              value={
                profile.status ||
                "-"
              }
            />
          </div>
        </div>
      </div>

      {/* MODAL EDIT */}

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(15,23,42,.48)",
            backdropFilter:
              "blur(5px)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: 18,
            zIndex: 9999,
          }}
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeEditModal();
            }
          }}
        >
          <div
            style={{
              width:
                "100%",
              maxWidth: 500,
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              background:
                "#fff",
              borderRadius:
                22,
              boxShadow:
                "0 30px 80px rgba(15,23,42,.25)",
            }}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER MODAL */}

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                padding:
                  "20px 22px",
                borderBottom:
                  "1px solid #E2E8F0",
              }}
            >
              <div>
                <h3
                  id="edit-profile-title"
                  style={{
                    margin: 0,
                    color:
                      "#0F172A",
                    fontSize: 19,
                    fontWeight: 750,
                  }}
                >
                  Edit Profile
                </h3>

                <p
                  style={{
                    margin:
                      "4px 0 0",
                    color:
                      "#64748B",
                    fontSize: 12,
                  }}
                >
                  Perbarui informasi akun
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={
                  saving
                }
                style={{
                  width: 34,
                  height: 34,
                  borderRadius:
                    "50%",
                  border:
                    "none",
                  background:
                    "#F1F5F9",
                  color:
                    "#64748B",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  cursor:
                    saving
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <MdClose
                  size={20}
                />
              </button>
            </div>

            {/* FORM */}

            <div
              style={{
                padding: 22,
              }}
            >
              <FormInput
                label="Nama Lengkap"
                value={
                  formData.nama
                }
                onChange={(e) =>
                  handleChange(
                    "nama",
                    e.target.value
                  )
                }
                placeholder="Masukkan nama lengkap"
              />

              <FormInput
                label="Email"
                type="email"
                value={
                  formData.email
                }
                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value
                  )
                }
                placeholder="Masukkan email"
              />

              <FormInput
                label="Nomor Telepon"
                value={
                  formData.phone
                }
                onChange={(e) =>
                  handleChange(
                    "phone",
                    e.target.value
                  )
                }
                placeholder="Masukkan nomor telepon"
              />

              <div
                style={{
                  marginBottom:
                    20,
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#334155",
                    fontSize: 13,
                    fontWeight: 650,
                    marginBottom: 7,
                  }}
                >
                  Alamat
                </label>

                <textarea
                  rows={3}
                  value={
                    formData.alamat ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "alamat",
                      e.target.value
                    )
                  }
                  placeholder="Masukkan alamat"
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    resize:
                      "vertical",
                    minHeight: 90,
                    padding:
                      "11px 13px",
                    border:
                      "1px solid #CBD5E1",
                    borderRadius: 11,
                    outline:
                      "none",
                    fontSize: 13,
                    color:
                      "#1E293B",
                    background:
                      "#fff",
                  }}
                />
              </div>

              {/* BUTTON */}

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: 9,
                }}
              >
                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  disabled={
                    saving
                  }
                  style={{
                    border:
                      "1px solid #CBD5E1",
                    background:
                      "#fff",
                    color:
                      "#475569",
                    padding:
                      "11px 17px",
                    borderRadius:
                      10,
                    fontWeight:
                      600,
                    cursor:
                      saving
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving
                  }
                  style={{
                    border:
                      "none",
                    background:
                      saving
                        ? "#94A3B8"
                        : "linear-gradient(135deg,#243BB8,#4F6BFF)",
                    color:
                      "#fff",
                    padding:
                      "11px 18px",
                    borderRadius:
                      10,
                    fontWeight:
                      650,
                    cursor:
                      saving
                        ? "not-allowed"
                        : "pointer",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 7,
                  }}
                >
                  {saving ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                      />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <MdSave
                        size={18}
                      />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// INFO CARD
// =========================================================

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        display:
          "flex",
        alignItems:
          "center",
        gap: 13,
        padding: 16,
        borderRadius: 15,
        background:
          "#F8FAFC",
        border:
          "1px solid #E2E8F0",
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          minWidth: 42,
          borderRadius: 12,
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          background:
            "#EEF2FF",
          color:
            "#3448C5",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          minWidth: 0,
        }}
      >
        <div
          style={{
            color:
              "#64748B",
            fontSize: 11,
            marginBottom: 4,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color:
              "#1E293B",
            fontSize: 13.5,
            fontWeight: 650,
            overflow:
              "hidden",
            textOverflow:
              "ellipsis",
            whiteSpace:
              "nowrap",
          }}
          title={value}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// FORM INPUT
// =========================================================

function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div
      style={{
        marginBottom: 16,
      }}
    >
      <label
        style={{
          display:
            "block",
          color:
            "#334155",
          fontSize: 13,
          fontWeight: 650,
          marginBottom: 7,
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={
          placeholder
        }
        style={{
          width:
            "100%",
          boxSizing:
            "border-box",
          padding:
            "11px 13px",
          border:
            "1px solid #CBD5E1",
          borderRadius: 11,
          outline:
            "none",
          fontSize: 13,
          color:
            "#1E293B",
          background:
            "#fff",
        }}
      />
    </div>
  );
}

export default Profile;