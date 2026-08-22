import { useState, useEffect, useMemo } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Table,
  Modal,
  Pagination,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import {
  FaUsers,
  FaUserPlus,
  FaCalendarAlt,
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowCircleUp,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Backend stores status as 'active' / 'non active'
const isActiveStatus = (status) =>
  (status || "").toLowerCase().trim() === "active";

const titleAbbrev = (title) => {
  if (title === "Tuan") return "Tn";
  if (title === "Nyonya") return "Ny";
  if (title === "Nona") return "Nn";
  return title || "-";
};

const titleFull = (title) => {
  if (title === "Tn") return "Tuan";
  if (title === "Ny") return "Nyonya";
  if (title === "Nn") return "Nona";
  return title || "-";
};

function UserManagement() {
  const navigate = useNavigate();

  // ===========================
  // Phone formatting
  // ===========================
  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";

    let number = String(phone).replace(/\D/g, "");

    if (number.startsWith("62")) {
      number = number.slice(2);
    }

    if (number.startsWith("0")) {
      number = number.slice(1);
    }

    if (number.length >= 10) {
      return `(+62) ${number.replace(
        /(\d{3})(\d{4})(\d+)/,
        "$1-$2-$3"
      )}`;
    }

    return `(+62) ${number}`;
  };

  // ===========================
  // Users
  // ===========================
  const [dataUsers, setDataUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Role master dari backend untuk memastikan User Management
  // menampilkan nama role berdasarkan role_id.
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const loadRoles = async () => {
    try {
      setRolesLoading(true);

      const response = await api.get("/api/roles");
      const body = response?.data;

      const list = Array.isArray(body)
        ? body
        : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.roles)
        ? body.roles
        : [];

      setRoles(list);
    } catch (err) {
      console.error("Gagal mengambil role:", err);
      console.error("Detail error role:", err.response?.data || err.message);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/users");

      if (response.data.status === "success") {
        const users = response.data.data || [];

        const normalizedUsers = users.map((user) => ({
          ...user,
          alasan_non_active:
            user.alasan_non_active ??
            user.alasan_nonactive ??
            user.alasanNonActive ??
            user.reason ??
            "",
          role:
            user.role ||
            roles.find(
              (r) => String(r.id_role) === String(user.role_id)
            )?.nama_role ||
            "-",
        }));

        setDataUsers(normalizedUsers);
      } else {
        setError(
          response.data.message ||
            "Gagal mengambil data pengguna."
        );
      }
    } catch (err) {
      console.error("Gagal mengambil data user:", err);

      setError(
        err.response?.data?.message ||
          "Gagal mengambil data pengguna dari server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
    loadUsers();

    const refreshRoles = () => {
      loadRoles();
    };

    window.addEventListener("focus", refreshRoles);

    return () => {
      window.removeEventListener("focus", refreshRoles);
    };
  }, []);

  useEffect(() => {
    if (rolesLoading) return;

    setDataUsers((prev) =>
      prev.map((user) => ({
        ...user,
        role:
          user.role ||
          roles.find(
            (r) => String(r.id_role) === String(user.role_id)
          )?.nama_role ||
          "-",
      }))
    );
  }, [roles, rolesLoading]);

  // ===========================
  // Pagination
  // ===========================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ===========================
  // Calendar / date filter
  // ===========================
  const [calendarMode, setCalendarMode] = useState("filter");
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date) =>
    date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const today = useMemo(() => new Date(), []);

  const defaultStart = useMemo(
    () => new Date(today.getFullYear(), 0, 1),
    [today]
  );

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(today);

  const [dateRange, setDateRange] = useState(
    `${formatDate(defaultStart)} - ${formatDate(today)}`
  );

  // ===========================
  // Search
  // ===========================
  const [search, setSearch] = useState("");
  const isSearching = search.trim() !== "";

  // ===========================
  // Active / Non Active tab
  // ===========================
  const [tab, setTab] = useState(() => {
    return localStorage.getItem("userTab") || "active";
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, search]);

  useEffect(() => {
    localStorage.setItem("userTab", tab);
  }, [tab]);

  // ===========================
  // Detail modal
  // ===========================
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ===========================
  // Delete modal (HAPUS PERMANEN)
  // ===========================
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteUser = async () => {
    if (!selectedDelete) return;

    try {
      setDeleting(true);

      const userId = selectedDelete.id_user;

      await api.delete(`/api/users/${userId}`);

      setShowDelete(false);
      setSelectedDelete(null);

      await loadUsers();
    } catch (err) {
      console.error("Gagal menghapus user:", err);

      alert(
        err.response?.data?.message ||
          "Gagal menghapus user."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ===========================
  // Reactivate
  // ===========================
  const [showReActive, setShowReActive] = useState(false);
  const [selectedReActive, setSelectedReActive] = useState(null);
  const [reactivating, setReactivating] = useState(false);

  const handleReactivateUser = async () => {
    if (!selectedReActive) return;

    try {
      setReactivating(true);

      await api.put(
        `/api/users/${selectedReActive.id_user}/reactivate`
      );

      setShowReActive(false);
      setSelectedReActive(null);

      setTab("active");

      await loadUsers();
    } catch (err) {
      console.error(
        "Gagal mengaktifkan kembali user:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Gagal mengaktifkan kembali user."
      );
    } finally {
      setReactivating(false);
    }
  };

  // ===========================
  // Filter data
  // ===========================
  const filteredUsers = dataUsers
  .filter((item) =>
    tab === "active"
      ? isActiveStatus(item.status)
      : !isActiveStatus(item.status)
  )
  .filter((item) => {
    const keyword = search.toLowerCase();

    return (
      (item.nama || "")
        .toLowerCase()
        .includes(keyword) ||
      (item.email || "")
        .toLowerCase()
        .includes(keyword) ||
      (item.phone || "")
        .toLowerCase()
        .includes(keyword) ||
      (item.role || "")
        .toLowerCase()
        .includes(keyword)
    );
  })
  .filter((item) => {
    if (!item.created_at) return false;

    const created = new Date(item.created_at);

    return (
      created >= startDate &&
      created <=
        new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59,
          999
        )
    );
  })
  .sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    const timeA = !isNaN(dateA.getTime())
      ? dateA.getTime()
      : 0;

    const timeB = !isNaN(dateB.getTime())
      ? dateB.getTime()
      : 0;

    // created_at terbaru → paling atas
    if (timeA !== timeB) {
      return timeB - timeA;
    }

    // created_at sama/tidak tersedia → id_user terbesar paling atas
    return (
      Number(b.id_user || 0) -
      Number(a.id_user || 0)
    );
  });
  
  // ===========================
  // Pagination
  // ===========================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastUser =
    currentPage * itemsPerPage;

  const indexOfFirstUser =
    indexOfLastUser - itemsPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  // ===========================
  // Stats
  // ===========================
  const ninetyDaysAgo = useMemo(() => {
    const d = new Date(today);
    d.setDate(today.getDate() - 90);
    return d;
  }, [today]);

  const newMembers = dataUsers.filter((user) => {
    const created = new Date(user.created_at);

    return (
      !isNaN(created.getTime()) &&
      created >= ninetyDaysAgo &&
      created <= today
    );
  });

  const totalMembers = dataUsers.length;

  return (
    <Container fluid className="py-3 user-management-page">

      <style>{`
        .user-management-page {
          --um-primary: #4f46e5;
          --um-primary-dark: #4338ca;
          --um-text: #0f172a;
          --um-muted: #64748b;
          --um-border: #e8edf5;
          --um-surface: #ffffff;
          --um-bg: #f6f8fc;
          color: var(--um-text);
        }

        .user-management-page .um-section-title {
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .user-management-page > .d-flex.justify-content-between {
          padding: 8px 4px 6px;
        }

        .user-management-page > .d-flex.justify-content-between h2 {
          font-size: clamp(1.55rem, 2.4vw, 2rem) !important;
          letter-spacing: -0.7px;
          margin-bottom: 6px;
        }

        .user-management-page > .d-flex.justify-content-between p {
          font-size: 0.92rem;
        }

        .user-management-page .card {
          border-color: var(--um-border) !important;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.055) !important;
        }

        /* Statistic cards */
        .user-management-page .row.g-4.mb-4 > .col-md-6 > .card {
          position: relative;
          border-radius: 20px !important;
          min-height: 132px !important;
          background: var(--um-surface) !important;
          border: 1px solid var(--um-border) !important;
          overflow: hidden;
        }

        .user-management-page .row.g-4.mb-4 > .col-md-6:first-child > .card::before,
        .user-management-page .row.g-4.mb-4 > .col-md-6:last-child > .card::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 5px;
          background: linear-gradient(180deg, #6366f1, #4f46e5);
        }

        .user-management-page .row.g-4.mb-4 > .col-md-6:last-child > .card::before {
          background: linear-gradient(180deg, #f59e0b, #f97316);
        }

        .user-management-page .row.g-4.mb-4 .card-body {
          padding: 24px 26px !important;
        }

        .user-management-page .row.g-4.mb-4 .card-body > div > div:first-child {
          letter-spacing: 0.7px !important;
          font-size: 11px !important;
          color: #94a3b8 !important;
        }

        .user-management-page .row.g-4.mb-4 h2 {
          font-size: 2.25rem !important;
          letter-spacing: -1px;
        }

        .user-management-page .row.g-4.mb-4 .card-body > div > div:last-child {
          width: 58px !important;
          height: 58px !important;
          border-radius: 17px !important;
          box-shadow: none !important;
        }

        /* Main application surface */
        .user-management-page > .card {
          border-radius: 22px !important;
          background: rgba(255,255,255,.96) !important;
        }

        .user-management-page > .card > .card-body {
          padding: 28px !important;
        }

        /* Tabs */
        .user-management-page > .card > .card-body > div[style*="border-bottom"] {
          gap: 8px !important;
          border-bottom: 1px solid var(--um-border) !important;
          margin-bottom: 22px !important;
        }

        .user-management-page > .card > .card-body > div[style*="border-bottom"] p {
          padding: 10px 18px 13px !important;
          margin: 0 !important;
          border-bottom-width: 3px !important;
          border-bottom-style: solid !important;
          border-bottom-color: transparent !important;
          border-radius: 9px 9px 0 0;
          font-size: 0.9rem;
          transition: all .2s ease;
        }

        .user-management-page > .card > .card-body > div[style*="border-bottom"] p:hover {
          background: #f8faff;
          color: var(--um-primary) !important;
        }

        /* Search/filter controls */
        .user-management-page .input-group {
          border-radius: 13px !important;
          border-color: #e2e8f0 !important;
          background: #fff !important;
          transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
        }

        .user-management-page .input-group:focus-within {
          border-color: #a5b4fc !important;
          box-shadow: 0 0 0 4px rgba(99,102,241,.10) !important;
        }

        .user-management-page .input-group-text {
          padding-left: 16px !important;
          padding-right: 8px !important;
          color: #94a3b8 !important;
          border-color: #e2e8f0 !important;
        }

        .user-management-page .form-control {
          font-size: 0.92rem !important;
          color: #334155 !important;
        }

        .user-management-page .form-control::placeholder {
          color: #a0aec0;
        }

        .user-management-page .row.align-items-center.mb-4 .btn {
          border-radius: 13px !important;
          background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
          height: 52px !important;
          border: none !important;
          box-shadow: 0 8px 18px rgba(79,70,229,.22) !important;
          font-size: .9rem;
        }

        .user-management-page .row.align-items-center.mb-4 .btn:hover {
          background: linear-gradient(135deg, #4f46e5, #4338ca) !important;
          box-shadow: 0 12px 24px rgba(79,70,229,.28) !important;
        }

        /* Table */
        .user-management-page .table-responsive {
          border: 1px solid var(--um-border);
          border-radius: 16px;
          overflow-x: auto;
          background: #fff;
        }

        .user-management-page table {
          min-width: 900px;
        }

        .user-management-page table thead {
          background: #f8fafc !important;
        }

        .user-management-page table th {
          background: #f8fafc !important;
          color: #94a3b8 !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          letter-spacing: .8px !important;
          padding: 15px 16px !important;
          white-space: nowrap;
          border-bottom: 1px solid var(--um-border) !important;
        }

        .user-management-page table td {
          padding: 16px !important;
          font-size: 13px !important;
          color: #475569 !important;
          border-bottom: 1px solid #f0f3f8 !important;
        }

        .user-management-page table tbody tr {
          transition: background .18s ease;
        }

        .user-management-page table tbody tr:hover {
          background: #fafbff !important;
        }

        .user-management-page table tbody tr:last-child td {
          border-bottom: none !important;
        }

        .user-management-page table td:nth-child(3) {
          font-weight: 700 !important;
          color: #1e293b !important;
        }

        .user-management-page table td:nth-child(7) .badge {
          background: #eef2ff !important;
          color: #4f46e5 !important;
          border: 1px solid #e0e7ff !important;
          border-radius: 999px !important;
          font-size: 11px !important;
          padding: 6px 10px !important;
        }

        /* Action icons */
        .user-management-page table td:last-child > div {
          gap: 7px !important;
        }

        .user-management-page table td:last-child span {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          transition: all .18s ease;
        }

        .user-management-page table td:last-child span:hover {
          background: #eef2ff;
          transform: translateY(-1px);
        }

        .user-management-page table td:last-child span:last-child:hover {
          background: #fef2f2;
        }

        .user-management-page table td:last-child svg {
          font-size: 15px !important;
        }

        /* Pagination */
        .user-management-page .pagination {
          gap: 5px;
        }

        .user-management-page .pagination .page-link {
          min-width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0 !important;
          border-radius: 10px !important;
          color: #64748b;
          background: #fff;
          font-size: 12px;
          box-shadow: none;
        }

        .user-management-page .pagination .page-item.active .page-link {
          background: #4f46e5 !important;
          border-color: #4f46e5 !important;
          color: #fff !important;
        }

        /* Modals */
        .user-management-page .modal-content {
          border: 1px solid var(--um-border) !important;
          border-radius: 22px !important;
          box-shadow: 0 24px 70px rgba(15,23,42,.18) !important;
          overflow: hidden;
        }

        .user-management-page .modal-body {
          border-radius: 22px !important;
        }

        .user-management-page .modal h4 {
          color: #0f172a;
          letter-spacing: -.3px;
        }

        .user-management-page .modal .btn {
          border-radius: 12px !important;
          font-weight: 700 !important;
          font-size: .82rem;
        }

        /* Empty/loading states */
        .user-management-page .spinner-border {
          border-width: 2px;
        }

        /* Calendar */
        .user-management-page .react-calendar {
          border: none;
          width: 100%;
          max-width: 360px;
          font-family: inherit;
        }

        .user-management-page .react-calendar button {
          border-radius: 8px;
        }

        .user-management-page .react-calendar__tile--active {
          background: #4f46e5 !important;
          color: white !important;
        }

        .user-management-page .react-calendar__tile--now {
          background: #eef2ff;
          color: #4f46e5;
        }

        @media (max-width: 991.98px) {
          .user-management-page > .card > .card-body {
            padding: 20px !important;
          }

          .user-management-page .row.g-4.mb-4 {
            gap: 12px !important;
          }
        }

        @media (max-width: 767.98px) {
          .user-management-page {
            padding: 10px !important;
          }

          .user-management-page > .d-flex.justify-content-between {
            padding: 4px 2px 2px;
            margin-bottom: 18px !important;
          }

          .user-management-page > .d-flex.justify-content-between p {
            font-size: .82rem;
            line-height: 1.45;
          }

          .user-management-page .row.g-4.mb-4 > .col-md-6 > .card {
            min-height: 112px !important;
            border-radius: 17px !important;
          }

          .user-management-page .row.g-4.mb-4 .card-body {
            padding: 19px 21px !important;
          }

          .user-management-page .row.g-4.mb-4 h2 {
            font-size: 1.9rem !important;
          }

          .user-management-page .row.g-4.mb-4 .card-body > div > div:last-child {
            width: 50px !important;
            height: 50px !important;
            border-radius: 15px !important;
          }

          .user-management-page > .card {
            border-radius: 18px !important;
          }

          .user-management-page > .card > .card-body {
            padding: 16px !important;
          }

          .user-management-page > .card > .card-body > div[style*="border-bottom"] {
            margin-left: -2px;
            margin-right: -2px;
            gap: 2px !important;
          }

          .user-management-page > .card > .card-body > div[style*="border-bottom"] p {
            padding: 9px 13px 12px !important;
            font-size: .82rem;
          }

          .user-management-page .row.align-items-center.mb-4 {
            margin-bottom: 18px !important;
          }

          .user-management-page .row.align-items-center.mb-4 .text-end {
            text-align: left !important;
          }

          .user-management-page .row.align-items-center.mb-4 .btn {
            width: 100%;
          }

          .user-management-page .table-responsive {
            border-radius: 13px;
          }

          .user-management-page table th,
          .user-management-page table td {
            padding: 13px 12px !important;
          }

          .user-management-page .modal-body {
            padding: 25px !important;
          }

          .user-management-page .calendar-modal .modal-body {
            padding: 20px !important;
          }
        }

        @media (max-width: 480px) {
          .user-management-page > .d-flex.justify-content-between h2 {
            font-size: 1.35rem !important;
          }

          .user-management-page .row.g-4.mb-4 h2 {
            font-size: 1.75rem !important;
          }

          .user-management-page .row.g-4.mb-4 .card-body > div > div:last-child {
            width: 46px !important;
            height: 46px !important;
          }

          .user-management-page .row.g-4.mb-4 .card-body > div > div:last-child svg {
            font-size: 22px !important;
          }

          .user-management-page .modal .d-flex.justify-content-between {
            flex-direction: column-reverse;
            gap: 10px;
          }

          .user-management-page .modal .d-flex.justify-content-between .btn {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2
            style={{
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            User Management
          </h2>

          <p
            style={{
              color: "#64748B",
              marginBottom: 0,
            }}
          >
            Kelola seluruh data pengguna LMS.
          </p>
        </div>
      </div>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
        >
          {error}
        </Alert>
      )}

      {/* Statistik */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card
            style={{
              border: "1px solid #CFE6FF",
              borderRadius: "16px",
              background: "#EAF5FF",
              minHeight: "120px",
              overflow: "hidden",
              boxShadow:
                "0 10px 30px rgba(15,23,42,.08)",
              transition: "all .3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-6px)";
              e.currentTarget.style.borderColor =
                "#93C5FD";
              e.currentTarget.style.boxShadow =
                "0 18px 40px rgba(37,99,235,.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
              e.currentTarget.style.borderColor =
                "#CFE6FF";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(15,23,42,.08)";
            }}
          >
            <Card.Body className="px-4 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: "#64748B",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Member

                    <FaInfoCircle
                      size={12}
                      color="#9CA3AF"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <h2
                    style={{
                      fontSize: 46,
                      fontWeight: 800,
                      color: "#0F172A",
                      margin: "6px 0",
                      lineHeight: 1,
                    }}
                  >
                    {loading ? (
                      <Spinner
                        animation="border"
                        size="sm"
                      />
                    ) : (
                      totalMembers
                    )}
                  </h2>
                </div>

                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 20,
                    background: "#2563EB",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:
                      "0 10px 25px rgba(37,99,235,.25)",
                    border:
                      "4px solid rgba(255,255,255,.55)",
                    transition: "all .3s ease",
                  }}
                >
                  <FaUsers size={30} color="#fff" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            style={{
              border: "1px solid #F8E8B5",
              borderRadius: "16px",
              background: "#FFF5DA",
              minHeight: "120px",
              boxShadow:
                "0 8px 24px rgba(245, 158, 11, 0.12)",
              transition: "all .3s ease",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 18px 40px rgba(245, 158, 11, 0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(245, 158, 11, 0.12)";
            }}
          >
            <Card.Body className="px-4 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: "#64748B",
                      textTransform: "uppercase",
                    }}
                  >
                    Member Baru

                    <FaInfoCircle
                      size={12}
                      color="#9CA3AF"
                    />
                  </div>

                  <h2
                    style={{
                      fontSize: 37,
                      fontWeight: 800,
                      color: "#0F172A",
                      margin: "6px 0",
                      lineHeight: 1,
                    }}
                  >
                    {loading ? (
                      <Spinner
                        animation="border"
                        size="sm"
                      />
                    ) : (
                      newMembers.length
                    )}
                  </h2>

                  <small
                    style={{
                      color: "#6B7280",
                      fontSize: "12px",
                    }}
                  >
                    90 hari terakhir (
                    {ninetyDaysAgo.toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                    {" - "}
                    {today.toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                    )
                  </small>
                </div>

                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background:
                      "linear-gradient(135deg, #FBBF24, #F59E0B)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:
                      "0 10px 25px rgba(245, 158, 11, .25)",
                  }}
                >
                  <FaUserPlus
                    size={30}
                    color="#fff"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Card tabel */}
      <Card
        style={{
          background: "#FFFFFF",
          border: "1px solid #E9EEF5",
          borderRadius: "22px",
          boxShadow:
            "0 12px 32px rgba(15,23,42,.06)",
          overflow: "hidden",
          transition: "all .3s ease",
        }}
      >
        <Card.Body style={{ padding: "32px" }}>
          {/* Tab */}
          <div
            style={{
              display: "flex",
              gap: 40,
              borderBottom: "1px solid #eee",
              marginBottom: 20,
            }}
          >
            <p
              onClick={() => setTab("active")}
              style={{
                cursor: "pointer",
                fontWeight: 600,
                paddingBottom: 10,
                borderBottom:
                  tab === "active"
                    ? "3px solid #2538C8"
                    : "none",
                color:
                  tab === "active"
                    ? "#2538C8"
                    : "#64748B",
                marginBottom: 0,
              }}
            >
              Active
            </p>

            <p
              onClick={() => setTab("nonactive")}
              style={{
                cursor: "pointer",
                fontWeight: 600,
                paddingBottom: 10,
                borderBottom:
                  tab === "nonactive"
                    ? "3px solid #2538C8"
                    : "none",
                color:
                  tab === "nonactive"
                    ? "#2538C8"
                    : "#64748B",
                marginBottom: 0,
              }}
            >
              Non Active
            </p>
          </div>

          {/* Search + filter + create */}
          <Row className="align-items-center mb-4 g-3">
            <Col md={4}>
              <InputGroup
                style={{
                  height: 54,
                  border:
                    "1px solid #E2E8F0",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow:
                    "0 2px 10px rgba(15,23,42,.03)",
                }}
              >
                <InputGroup.Text
                  style={{
                    background: "#fff",
                    borderRight: "none",
                    borderColor: "#E2E8F0",
                  }}
                >
                  <FaSearch />
                </InputGroup.Text>

                <Form.Control
                  type="text"
                  placeholder="Cari user..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  style={{
                    borderLeft: "none",
                    height: 52,
                    fontSize: 16,
                    padding: "22px 18px",
                    fontWeight: 500,
                    boxShadow: "none",
                    borderColor: "#E2E8F0",
                  }}
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <InputGroup
                onClick={() => {
                  setCalendarMode("filter");
                  setShowCalendar(true);
                }}
                style={{
                  border:
                    "1px solid #E2E8F0",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow:
                    "0 2px 10px rgba(15,23,42,.03)",
                  cursor: "pointer",
                }}
              >
                <InputGroup.Text
                  style={{
                    background: "#fff",
                    borderRight: "none",
                    borderColor: "#E2E8F0",
                  }}
                >
                  <FaCalendarAlt />
                </InputGroup.Text>

                <Form.Control
                  readOnly
                  value={dateRange}
                  style={{
                    height: 52,
                    borderLeft: "none",
                    cursor: "pointer",
                    background: "#fff",
                    boxShadow: "none",
                  }}
                />
              </InputGroup>
            </Col>

            <Col
              md={4}
              className="text-end"
            >
              <Button
                onClick={() =>
                  navigate(
                    "/user-management/tambah"
                  )
                }
                style={{
                  background: "#2538C8",
                  border: "none",
                  height: 52,
                  padding: "0 26px",
                  borderRadius: 14,
                  fontWeight: 600,
                  boxShadow:
                    "0 6px 18px rgba(37,56,200,.25)",
                  transition: "all .25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "#1E2FB5";
                  e.currentTarget.style.transform =
                    "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(37,56,200,.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "#2538C8";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(37,56,200,.25)";
                }}
              >
                <FaPlus className="me-2" />
                Buat User Baru
              </Button>
            </Col>
          </Row>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner
                animation="border"
                style={{
                  color: "#2538C8",
                }}
              />

              <p
                className="mt-3"
                style={{
                  color: "#64748B",
                }}
              >
                Memuat data pengguna...
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <Table
                responsive
                hover
                className="align-middle"
                style={{
                  marginBottom: 0,
                  fontSize: 16,
                }}
              >
                <thead
                  style={{
                    background: "#F8FAFC",
                  }}
                >
                  <tr>
                    <th style={thStyle}>NO.</th>
                    <th style={thStyle}>TITLE</th>
                    <th style={thStyle}>NAMA</th>
                    <th style={thStyle}>
                      NO. HANDPHONE
                    </th>
                    <th style={thStyle}>EMAIL</th>
                    <th style={thStyle}>
                      TANGGAL LAHIR
                    </th>
                    <th style={thStyle}>ROLES</th>

                    {tab === "nonactive" && (
                      <th style={thStyle}>
                        ALASAN
                      </th>
                    )}

                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length > 0 ? (
                    currentUsers.map(
                      (item, index) => (
                        <tr
                          key={
                            item.id_user ??
                            index
                          }
                        >
                          <td style={tdStyle}>
                            {(currentPage - 1) *
                              itemsPerPage +
                              index +
                              1}
                          </td>

                          <td style={tdStyle}>
                            {titleAbbrev(
                              item.title
                            )}
                          </td>

                          <td style={tdStyle}>
                            {item.nama}
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              fontWeight: 500,
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatPhoneNumber(
                              item.phone
                            )}
                          </td>

                          <td style={tdStyle}>
                            {item.email}
                          </td>

                          <td style={tdStyle}>
                            {item.tanggal_lahir ||
                              "-"}
                          </td>

                          <td style={tdStyle}>
                            <Badge
                              bg="light"
                              text="dark"
                              style={{
                                border:
                                  "1px solid #E2E8F0",
                                fontWeight: 700,
                                fontSize:
                                  "14px",
                                padding:
                                  "8px 14px",
                                borderRadius:
                                  "8px",
                              }}
                            >
                              {item.role || "-"}
                            </Badge>
                          </td>

                          {tab === "nonactive" && (
                            <td
                              style={{
                                ...tdStyle,
                                maxWidth: 300,
                                minWidth: 180,
                                whiteSpace:
                                  "normal",
                                wordBreak:
                                  "break-word",
                              }}
                            >
                              {item.alasan_non_active &&
                              item.alasan_non_active.trim()
                                ? item.alasan_non_active
                                : "-"}
                            </td>
                          )}

                          <td>
                            <div
                              style={{
                                display: "flex",
                                gap: 24,
                                justifyContent:
                                  "center",
                              }}
                            >
                              {tab === "active" ? (
                                <span
                                  onClick={() => {
                                    setSelectedUser(
                                      item
                                    );
                                    setShowDetail(
                                      true
                                    );
                                  }}
                                  style={{
                                    cursor:
                                      "pointer",
                                  }}
                                  title="Lihat Detail"
                                >
                                  <FaEye
                                    size={20}
                                    color="#6B7280"
                                  />
                                </span>
                              ) : (
                                <span title="Aktifkan Kembali">
                                  <FaArrowCircleUp
                                    style={{
                                      fontSize: 22,
                                      cursor:
                                        "pointer",
                                      color:
                                        "#2563EB",
                                      transition:
                                        ".2s",
                                    }}
                                    onMouseEnter={(
                                      e
                                    ) =>
                                      (e.currentTarget.style.color =
                                        "#2538C8")
                                    }
                                    onMouseLeave={(
                                      e
                                    ) =>
                                      (e.currentTarget.style.color =
                                        "#2563EB")
                                    }
                                    onClick={() => {
                                      setSelectedReActive(
                                        item
                                      );
                                      setShowReActive(
                                        true
                                      );
                                    }}
                                  />
                                </span>
                              )}

                              <span
                                onClick={() =>
                                  navigate(
                                    `/user-management/edit/${item.id_user}`
                                  )
                                }
                                title="Edit"
                              >
                                <FaEdit
                                  style={{
                                    fontSize: 20,
                                    color:
                                      "#6B7280",
                                    cursor:
                                      "pointer",
                                  }}
                                />
                              </span>

                              {tab === "active" && (
                                <span
                                  onClick={() => {
                                    setSelectedDelete(
                                      item
                                    );
                                    setShowDelete(
                                      true
                                    );
                                  }}
                                  title="Hapus"
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: 20,
                                      color:
                                        "#EF4444",
                                      cursor:
                                        "pointer",
                                    }}
                                  />
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          tab === "nonactive"
                            ? 9
                            : 8
                        }
                        style={{
                          padding:
                            "60px 20px",
                          textAlign:
                            "center",
                          borderBottom:
                            "1px solid #EEF2F7",
                        }}
                      >
                        <FaSearch
                          size={40}
                          color="#CBD5E1"
                          style={{
                            marginBottom: 15,
                          }}
                        />

                        <h5
                          style={{
                            fontWeight: 600,
                            color:
                              "#334155",
                            marginBottom: 8,
                          }}
                        >
                          {isSearching
                            ? `Tidak ada hasil untuk "${search}"`
                            : "Belum ada data pengguna"}
                        </h5>

                        <p
                          style={{
                            color:
                              "#94A3B8",
                            marginBottom:
                              20,
                          }}
                        >
                          {isSearching
                            ? "Coba gunakan kata kunci lain."
                            : "Data pengguna akan ditampilkan di sini."}
                        </p>

                        {isSearching && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              setSearch("")
                            }
                          >
                            Reset Pencarian
                          </Button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {filteredUsers.length > 0 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() =>
                        setCurrentPage(1)
                      }
                      disabled={
                        currentPage === 1
                      }
                    />

                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage(
                          (prev) =>
                            Math.max(
                              prev - 1,
                              1
                            )
                        )
                      }
                      disabled={
                        currentPage === 1
                      }
                    />

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={
                            currentPage ===
                            i + 1
                          }
                          onClick={() =>
                            setCurrentPage(
                              i + 1
                            )
                          }
                          style={{
                            borderRadius: 10,
                            margin:
                              "0 4px",
                            border:
                              "1px solid #E2E8F0",
                          }}
                        >
                          {i + 1}
                        </Pagination.Item>
                      )
                    )}

                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage(
                          (prev) =>
                            Math.min(
                              prev + 1,
                              totalPages
                            )
                        )
                      }
                      disabled={
                        currentPage ===
                        totalPages
                      }
                    />

                    <Pagination.Last
                      onClick={() =>
                        setCurrentPage(
                          totalPages
                        )
                      }
                      disabled={
                        currentPage ===
                        totalPages
                      }
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modal Detail */}
      <Modal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        centered
      >
        <Modal.Body
          style={{
            padding: "36px",
            borderRadius: 18,
            position: "relative",
          }}
        >
          <h4
            style={{
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            Detail Data User
          </h4>

          <Row className="mb-3">
            <Col xs={5}>Title</Col>
            <Col
              xs={7}
              className="text-end"
            >
              {titleFull(
                selectedUser?.title
              )}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={5}>Nama</Col>
            <Col
              xs={7}
              className="text-end"
            >
              {selectedUser?.nama || "-"}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={5}>
              No. Handphone
            </Col>
            <Col
              xs={7}
              className="text-end"
            >
              {formatPhoneNumber(
                selectedUser?.phone
              )}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={5}>Email</Col>
            <Col
              xs={7}
              className="text-end"
            >
              {selectedUser?.email || "-"}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={5}>
              Tanggal Lahir
            </Col>
            <Col
              xs={7}
              className="text-end"
            >
              {selectedUser?.tanggal_lahir ||
                "-"}
            </Col>
          </Row>

          <Row>
            <Col xs={5}>Roles</Col>
            <Col
              xs={7}
              className="text-end"
            >
              {selectedUser?.role || "-"}
            </Col>
          </Row>

          <div
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#F1F5F9",
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              cursor: "pointer",
              transition: ".2s",
            }}
            onClick={() =>
              setShowDetail(false)
            }
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "#E2E8F0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "#F1F5F9")
            }
          >
            <FaTimes
              size={14}
              color="#64748B"
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Hapus User (permanen) */}
      <Modal
        show={showDelete}
        onHide={() =>
          !deleting &&
          setShowDelete(false)
        }
        centered
      >
        <Modal.Body
          style={{
            padding: "36px",
            borderRadius: 18,
          }}
        >
          <h4
            style={{
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Konfirmasi
          </h4>

          <p
            style={{
              textAlign: "center",
              marginTop: 10,
              marginBottom: 30,
              color: "#64748B",
            }}
          >
            Apakah kamu yakin ingin menghapus data{" "}
            <strong>
              {selectedDelete?.nama}
            </strong>
            ? Data yang sudah dihapus tidak dapat dikembalikan.
          </p>

          <div
            className="d-flex justify-content-between mt-4"
          >
            <Button
              style={{
                width: "48%",
                height: 46,
                background: "#EF4444",
                border: "none",
                borderRadius: 10,
              }}
              disabled={deleting}
              onClick={handleDeleteUser}
            >
              {deleting ? (
                <Spinner
                  animation="border"
                  size="sm"
                />
              ) : (
                "YA, HAPUS"
              )}
            </Button>

            <Button
              variant="outline-secondary"
              style={{
                width: "48%",
                height: 46,
                borderRadius: 10,
              }}
              disabled={deleting}
              onClick={() => {
                setShowDelete(false);
                setSelectedDelete(null);
              }}
            >
              TIDAK, KEMBALI
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Filter Tanggal */}
      <Modal
        show={showCalendar}
        onHide={() =>
          setShowCalendar(false)
        }
        centered
        dialogClassName="calendar-modal"
        size="xl"
      >
        <Modal.Body
          style={{
            padding: 35,
            borderRadius: 20,
            position: "relative",
          }}
        >
          <h4
            style={{
              textAlign: "center",
              fontWeight: 700,
              marginBottom: 30,
              color: "#1E293B",
            }}
          >
            Filter Tanggal
          </h4>

          <Row className="g-4">
            <Col md={6}>
              <div
                style={{
                  padding: 20,
                  border:
                    "1px solid #E5E7EB",
                  borderRadius: 18,
                  background: "#fff",
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems: "center",
                  minHeight: 310,
                  overflow: "hidden",
                }}
              >
                <Calendar
                  value={startDate}
                  onChange={
                    setStartDate
                  }
                />
              </div>

              <Form.Label
                className="mt-3"
                style={{
                  fontWeight: 600,
                }}
              >
                Dari
              </Form.Label>

              <Form.Control
                readOnly
                value={formatDate(
                  startDate
                )}
                style={{
                  height: 48,
                  borderRadius: 12,
                }}
              />
            </Col>

            <Col md={6}>
              <div
                style={{
                  padding: 20,
                  border:
                    "1px solid #E5E7EB",
                  borderRadius: 18,
                  background: "#fff",
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems: "center",
                  minHeight: 310,
                  overflow: "hidden",
                }}
              >
                <Calendar
                  value={endDate}
                  onChange={
                    setEndDate
                  }
                />
              </div>

              <Form.Label
                className="mt-3"
                style={{
                  fontWeight: 600,
                }}
              >
                Sampai
              </Form.Label>

              <Form.Control
                readOnly
                value={formatDate(
                  endDate
                )}
                style={{
                  height: 48,
                  borderRadius: 12,
                }}
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-end align-items-center mt-4">
            <Button
              style={{
                width: 180,
                height: 48,
                background: "#2538C8",
                border: "none",
                borderRadius: 12,
                fontWeight: 600,
              }}
              onClick={() => {
                setDateRange(
                  `${formatDate(
                    startDate
                  )} - ${formatDate(
                    endDate
                  )}`
                );

                setCurrentPage(1);
                setShowCalendar(false);
              }}
            >
              TERAPKAN
            </Button>
          </div>

          <div
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#F1F5F9",
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() =>
              setShowCalendar(false)
            }
          >
            <FaTimes
              size={14}
              color="#64748B"
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Aktifkan Kembali */}
      <Modal
        show={showReActive}
        centered
        onHide={() =>
          !reactivating &&
          setShowReActive(false)
        }
      >
        <Modal.Body
          style={{
            padding: 40,
            borderRadius: 20,
          }}
        >
          <h4
            style={{
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            Konfirmasi
          </h4>

          <p
            style={{
              textAlign: "center",
              color: "#64748B",
              marginTop: 10,
              marginBottom: 35,
            }}
          >
            Apakah kamu yakin ingin
            mengaktifkan kembali{" "}
            <strong>
              {selectedReActive?.nama}
            </strong>
            ?
          </p>

          <div className="d-flex gap-3">
            <Button
              style={{
                flex: 1,
                background: "#2538C8",
                border: "none",
                height: 46,
                borderRadius: 10,
              }}
              disabled={reactivating}
              onClick={
                handleReactivateUser
              }
            >
              {reactivating ? (
                <Spinner
                  animation="border"
                  size="sm"
                />
              ) : (
                "YA, AKTIFKAN DATA"
              )}
            </Button>

            <Button
              variant="outline-secondary"
              style={{
                flex: 1,
                height: 46,
                borderRadius: 10,
              }}
              disabled={reactivating}
              onClick={() =>
                setShowReActive(false)
              }
            >
              TIDAK, KEMBALI
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

const thStyle = {
  fontSize: 15,
  padding: "22px 18px",
  fontWeight: 600,
  color: "#64748B",
  borderBottom: "1px solid #E2E8F0",
  letterSpacing: ".5px",
};

const tdStyle = {
  padding: "18px 16px",
  verticalAlign: "middle",
  fontSize: 14,
  color: "#334155",
  borderBottom: "1px solid #EEF2F7",
};

export default UserManagement;