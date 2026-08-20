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
    loadUsers();
  }, []);

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

      const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
      const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();

      // Data terbaru selalu berada di paling atas.
      if (timeB !== timeA) {
        return timeB - timeA;
      }

      // Jika waktu sama, gunakan ID user sebagai urutan kedua
      // agar user yang baru dibuat tetap berada di atas.
      return Number(b.id_user || 0) - Number(a.id_user || 0);
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
    <Container fluid className="py-2">
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