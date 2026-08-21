import { useState, useEffect, useMemo } from "react";
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
  FaBook,
  FaChalkboardTeacher,
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

// ===========================
// HARDCODE DUMMY DATA (nanti diganti fetch API kayak UserManagement.jsx)
// ===========================
const DUMMY_KELAS = [
  {
    id_kelas: 1,
    nama_kelas: "React Fundamental",
    roles: "Member",
    deskripsi:
      "Belajar dasar React mulai dari komponen, state, hingga routing.",
    status: "active",
    created_at: "2026-06-10",
    alasan_non_active: "",
  },
  {
    id_kelas: 2,
    nama_kelas: "Python untuk Data Analyst",
    roles: "Member",
    deskripsi:
      "Analisis data menggunakan Python, Pandas, dan visualisasi data.",
    status: "active",
    created_at: "2026-07-02",
    alasan_non_active: "",
  },
  {
    id_kelas: 3,
    nama_kelas: "UI/UX Design Dasar",
    roles: "Admin",
    deskripsi: "Prinsip dasar UI/UX, wireframing, dan prototyping.",
    status: "non active",
    created_at: "2026-03-15",
    alasan_non_active: "Materi sedang diperbarui ke versi terbaru.",
  },
  {
    id_kelas: 4,
    nama_kelas: "Falcon Framework untuk Backend",
    roles: "Admin",
    deskripsi: "Membangun REST API dengan Python Falcon dan MySQL.",
    status: "active",
    created_at: "2026-08-01",
    alasan_non_active: "",
  },
  {
    id_kelas: 5,
    nama_kelas: "Digital Marketing untuk Pemula",
    roles: "Member",
    deskripsi: "Dasar-dasar digital marketing, SEO, dan social media ads.",
    status: "non active",
    created_at: "2026-01-20",
    alasan_non_active: "Instruktur cuti, kelas dijadwalkan ulang.",
  },
  {
    id_kelas: 6,
    nama_kelas: "Mobile App dengan React Native",
    roles: "Member",
    deskripsi: "Membangun aplikasi mobile cross-platform dengan React Native.",
    status: "active",
    created_at: "2026-05-28",
    alasan_non_active: "",
  },
];

const isActiveStatus = (status) =>
  (status || "").toLowerCase().trim() === "active";

function Kelas() {
  const navigate = useNavigate();

  // ===========================
  // Data kelas (HARDCODE sementara)
  // ===========================
  const [dataKelas, setDataKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadKelas = () => {
    setLoading(true);
    setError("");

    // Simulasi delay kayak network request
    setTimeout(() => {
      setDataKelas(DUMMY_KELAS);
      setLoading(false);
    }, 400);

    // ===========================
    // NANTI KALAU BACKEND SUDAH SIAP, GANTI JADI:
    // ===========================
    // try {
    //   setLoading(true);
    //   setError("");
    //   const response = await api.get("/api/kelas");
    //   if (response.data.status === "success") {
    //     setDataKelas(response.data.data || []);
    //   } else {
    //     setError(response.data.message || "Gagal mengambil data kelas.");
    //   }
    // } catch (err) {
    //   setError(err.response?.data?.message || "Gagal mengambil data kelas dari server.");
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    loadKelas();
  }, []);

  // ===========================
  // Pagination
  // ===========================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ===========================
  // Calendar / date filter
  // ===========================
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
    return localStorage.getItem("kelasTab") || "active";
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, search]);

  useEffect(() => {
    localStorage.setItem("kelasTab", tab);
  }, [tab]);

  // ===========================
  // Detail modal
  // ===========================
  const [showDetail, setShowDetail] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState(null);

  // ===========================
  // Delete modal (HAPUS PERMANEN)
  // ===========================
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteKelas = () => {
    if (!selectedDelete) return;

    setDeleting(true);

    // Simulasi hapus data lokal (nanti diganti api.delete(`/api/kelas/${id}`))
    setTimeout(() => {
      setDataKelas((prev) =>
        prev.filter(
          (item) => item.id_kelas !== selectedDelete.id_kelas
        )
      );

      setShowDelete(false);
      setSelectedDelete(null);
      setDeleting(false);
    }, 300);
  };

  // ===========================
  // Reactivate
  // ===========================
  const [showReActive, setShowReActive] = useState(false);
  const [selectedReActive, setSelectedReActive] = useState(null);
  const [reactivating, setReactivating] = useState(false);

  const handleReactivateKelas = () => {
    if (!selectedReActive) return;

    setReactivating(true);

    // Simulasi reaktivasi data lokal (nanti diganti api.put(`/api/kelas/${id}/reactivate`))
    setTimeout(() => {
      setDataKelas((prev) =>
        prev.map((item) =>
          item.id_kelas === selectedReActive.id_kelas
            ? { ...item, status: "active", alasan_non_active: "" }
            : item
        )
      );

      setShowReActive(false);
      setSelectedReActive(null);
      setReactivating(false);
      setTab("active");
    }, 300);
  };

  // ===========================
  // Filter data
  // ===========================
  const filteredKelas = dataKelas
    .filter((item) =>
      tab === "active"
        ? isActiveStatus(item.status)
        : !isActiveStatus(item.status)
    )
    .filter((item) => {
      const keyword = search.toLowerCase();

      return (
        (item.nama_kelas || "").toLowerCase().includes(keyword) ||
        (item.roles || "").toLowerCase().includes(keyword)
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

      const timeA = !isNaN(dateA.getTime()) ? dateA.getTime() : 0;
      const timeB = !isNaN(dateB.getTime()) ? dateB.getTime() : 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      return Number(b.id_kelas || 0) - Number(a.id_kelas || 0);
    });

  // ===========================
  // Pagination
  // ===========================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredKelas.length / itemsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastKelas = currentPage * itemsPerPage;
  const indexOfFirstKelas = indexOfLastKelas - itemsPerPage;

  const currentKelas = filteredKelas.slice(
    indexOfFirstKelas,
    indexOfLastKelas
  );

  // ===========================
  // Stats
  // ===========================
  const ninetyDaysAgo = useMemo(() => {
    const d = new Date(today);
    d.setDate(today.getDate() - 90);
    return d;
  }, [today]);

  const newKelas = dataKelas.filter((item) => {
    const created = new Date(item.created_at);

    return (
      !isNaN(created.getTime()) &&
      created >= ninetyDaysAgo &&
      created <= today
    );
  });

  const totalKelas = dataKelas.length;

  return (
    <Container fluid className="py-3 kelas-page">
      <style>{`
        .kelas-page {
          --um-primary: #4f46e5;
          --um-text: #0f172a;
          --um-muted: #64748b;
          --um-border: #e8edf5;
          color: var(--um-text);
        }

        .kelas-page .card {
          border-color: var(--um-border) !important;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.055) !important;
        }

        .kelas-page .table-responsive {
          border: 1px solid var(--um-border);
          border-radius: 16px;
          overflow-x: auto;
          background: #fff;
        }

        .kelas-page table {
          min-width: 700px;
        }

        .kelas-page table th {
          background: #f8fafc !important;
          color: #94a3b8 !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          letter-spacing: .8px !important;
          padding: 15px 16px !important;
          white-space: nowrap;
          border-bottom: 1px solid var(--um-border) !important;
        }

        .kelas-page table td {
          padding: 16px !important;
          font-size: 13px !important;
          color: #475569 !important;
          border-bottom: 1px solid #f0f3f8 !important;
          vertical-align: middle;
        }

        .kelas-page table tbody tr:hover {
          background: #fafbff !important;
        }

        .kelas-page table td:last-child span {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          transition: all .18s ease;
        }

        .kelas-page table td:last-child span:hover {
          background: #eef2ff;
          transform: translateY(-1px);
        }

        .kelas-page .pagination .page-link {
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
        }

        .kelas-page .pagination .page-item.active .page-link {
          background: #4f46e5 !important;
          border-color: #4f46e5 !important;
          color: #fff !important;
        }

        .kelas-page .modal-content {
          border: 1px solid var(--um-border) !important;
          border-radius: 22px !important;
          box-shadow: 0 24px 70px rgba(15,23,42,.18) !important;
          overflow: hidden;
        }

        @media (max-width: 767.98px) {
          .kelas-page .table-responsive {
            border-radius: 13px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: "#1E293B" }}>
            Kelas
          </h2>
          <p style={{ color: "#64748B", marginBottom: 0 }}>
            Kelola data master kelas/kursus LMS.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
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
              boxShadow: "0 10px 30px rgba(15,23,42,.08)",
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
                    Total Kelas
                    <FaInfoCircle size={12} color="#9CA3AF" />
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
                      <Spinner animation="border" size="sm" />
                    ) : (
                      totalKelas
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
                    boxShadow: "0 10px 25px rgba(37,99,235,.25)",
                    border: "4px solid rgba(255,255,255,.55)",
                  }}
                >
                  <FaBook size={28} color="#fff" />
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
              boxShadow: "0 8px 24px rgba(245, 158, 11, 0.12)",
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
                    Kelas Baru
                    <FaInfoCircle size={12} color="#9CA3AF" />
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
                      <Spinner animation="border" size="sm" />
                    ) : (
                      newKelas.length
                    )}
                  </h2>

                  <small style={{ color: "#6B7280", fontSize: "12px" }}>
                    90 hari terakhir (
                    {ninetyDaysAgo.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {" - "}
                    {today.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    )
                  </small>
                </div>

                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 10px 25px rgba(245, 158, 11, .25)",
                  }}
                >
                  <FaChalkboardTeacher size={28} color="#fff" />
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
          boxShadow: "0 12px 32px rgba(15,23,42,.06)",
          overflow: "hidden",
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
                  tab === "active" ? "3px solid #2538C8" : "none",
                color: tab === "active" ? "#2538C8" : "#64748B",
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
                  tab === "nonactive" ? "3px solid #2538C8" : "none",
                color: tab === "nonactive" ? "#2538C8" : "#64748B",
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
                  border: "1px solid #E2E8F0",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#fff",
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
                  placeholder="Cari kelas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => setShowCalendar(true)}
                style={{
                  border: "1px solid #E2E8F0",
                  borderRadius: 16,
                  overflow: "hidden",
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

            <Col md={4} className="text-end">
              <Button
                onClick={() => navigate("/master-data/kelas/tambah")}
                style={{
                  background: "#2538C8",
                  border: "none",
                  height: 52,
                  padding: "0 26px",
                  borderRadius: 14,
                  fontWeight: 600,
                  boxShadow: "0 6px 18px rgba(37,56,200,.25)",
                }}
              >
                <FaPlus className="me-2" />
                Buat Kelas Baru
              </Button>
            </Col>
          </Row>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#2538C8" }} />
              <p className="mt-3" style={{ color: "#64748B" }}>
                Memuat data kelas...
              </p>
            </div>
          ) : (
            <>
              <Table
                responsive
                hover
                className="align-middle"
                style={{ marginBottom: 0, fontSize: 16 }}
              >
                <thead style={{ background: "#F8FAFC" }}>
                  <tr>
                    <th style={thStyle}>NO.</th>
                    <th style={thStyle}>NAMA KELAS</th>
                    <th style={thStyle}>ROLES</th>

                    {tab === "nonactive" && (
                      <th style={thStyle}>ALASAN</th>
                    )}

                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredKelas.length > 0 ? (
                    currentKelas.map((item, index) => (
                      <tr key={item.id_kelas ?? index}>
                        <td style={tdStyle}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            fontWeight: 700,
                            color: "#1e293b",
                          }}
                        >
                          {item.nama_kelas}
                        </td>

                        <td style={tdStyle}>
                          <Badge
                            bg="light"
                            text="dark"
                            style={{
                              border: "1px solid #E2E8F0",
                              fontWeight: 700,
                              fontSize: "12px",
                              padding: "7px 12px",
                              borderRadius: "8px",
                              background: "#eef2ff",
                              color: "#4f46e5",
                            }}
                          >
                            {item.roles || "-"}
                          </Badge>
                        </td>

                        {tab === "nonactive" && (
                          <td
                            style={{
                              ...tdStyle,
                              maxWidth: 260,
                              minWidth: 160,
                              whiteSpace: "normal",
                              wordBreak: "break-word",
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
                              justifyContent: "center",
                            }}
                          >
                            {tab === "active" ? (
                              <span
                                onClick={() => {
                                  setSelectedKelas(item);
                                  setShowDetail(true);
                                }}
                                style={{ cursor: "pointer" }}
                                title="Lihat Detail"
                              >
                                <FaEye size={20} color="#6B7280" />
                              </span>
                            ) : (
                              <span title="Aktifkan Kembali">
                                <FaArrowCircleUp
                                  style={{
                                    fontSize: 22,
                                    cursor: "pointer",
                                    color: "#2563EB",
                                  }}
                                  onClick={() => {
                                    setSelectedReActive(item);
                                    setShowReActive(true);
                                  }}
                                />
                              </span>
                            )}

                            <span
                              onClick={() =>
                                navigate(
                                  `/master-data/kelas/edit/${item.id_kelas}`
                                )
                              }
                              title="Edit"
                            >
                              <FaEdit
                                style={{
                                  fontSize: 20,
                                  color: "#6B7280",
                                  cursor: "pointer",
                                }}
                              />
                            </span>

                            {tab === "active" && (
                              <span
                                onClick={() => {
                                  setSelectedDelete(item);
                                  setShowDelete(true);
                                }}
                                title="Hapus"
                              >
                                <FaTrash
                                  style={{
                                    fontSize: 20,
                                    color: "#EF4444",
                                    cursor: "pointer",
                                  }}
                                />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={tab === "nonactive" ? 6 : 5}
                        style={{
                          padding: "60px 20px",
                          textAlign: "center",
                          borderBottom: "1px solid #EEF2F7",
                        }}
                      >
                        <FaSearch
                          size={40}
                          color="#CBD5E1"
                          style={{ marginBottom: 15 }}
                        />

                        <h5
                          style={{
                            fontWeight: 600,
                            color: "#334155",
                            marginBottom: 8,
                          }}
                        >
                          {isSearching
                            ? `Tidak ada hasil untuk "${search}"`
                            : "Belum ada data kelas"}
                        </h5>

                        <p style={{ color: "#94A3B8", marginBottom: 20 }}>
                          {isSearching
                            ? "Coba gunakan kata kunci lain."
                            : "Data kelas akan ditampilkan di sini."}
                        </p>

                        {isSearching && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setSearch("")}
                          >
                            Reset Pencarian
                          </Button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {filteredKelas.length > 0 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    />

                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{
                          borderRadius: 10,
                          margin: "0 4px",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modal Detail */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
        <Modal.Body
          style={{ padding: "36px", borderRadius: 18, position: "relative" }}
        >
          <h4 style={{ fontWeight: 700, textAlign: "center", marginBottom: 30 }}>
            Detail Data Kelas
          </h4>

          <Row className="mb-3">
            <Col xs={5}>Nama Kelas</Col>
            <Col xs={7} className="text-end">
              {selectedKelas?.nama_kelas || "-"}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={5}>Roles</Col>
            <Col xs={7} className="text-end">
              {selectedKelas?.roles || "-"}
            </Col>
          </Row>

          <Row>
            <Col xs={5}>Deskripsi</Col>
            <Col xs={7} className="text-end">
              {selectedKelas?.deskripsi || "-"}
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
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setShowDetail(false)}
          >
            <FaTimes size={14} color="#64748B" />
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Hapus Kelas (permanen) */}
      <Modal
        show={showDelete}
        onHide={() => !deleting && setShowDelete(false)}
        centered
      >
        <Modal.Body style={{ padding: "36px", borderRadius: 18 }}>
          <h4 style={{ fontWeight: 700, textAlign: "center" }}>Konfirmasi</h4>

          <p
            style={{
              textAlign: "center",
              marginTop: 10,
              marginBottom: 30,
              color: "#64748B",
            }}
          >
            Apakah kamu yakin ingin menghapus kelas{" "}
            <strong>{selectedDelete?.nama_kelas}</strong>? Data yang sudah
            dihapus tidak dapat dikembalikan.
          </p>

          <div className="d-flex justify-content-between mt-4">
            <Button
              style={{
                width: "48%",
                height: 46,
                background: "#EF4444",
                border: "none",
                borderRadius: 10,
              }}
              disabled={deleting}
              onClick={handleDeleteKelas}
            >
              {deleting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "YA, HAPUS"
              )}
            </Button>

            <Button
              variant="outline-secondary"
              style={{ width: "48%", height: 46, borderRadius: 10 }}
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
        onHide={() => setShowCalendar(false)}
        centered
        dialogClassName="calendar-modal"
        size="xl"
      >
        <Modal.Body
          style={{ padding: 35, borderRadius: 20, position: "relative" }}
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
                  border: "1px solid #E5E7EB",
                  borderRadius: 18,
                  background: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 310,
                  overflow: "hidden",
                }}
              >
                <Calendar value={startDate} onChange={setStartDate} />
              </div>

              <Form.Label className="mt-3" style={{ fontWeight: 600 }}>
                Dari
              </Form.Label>

              <Form.Control
                readOnly
                value={formatDate(startDate)}
                style={{ height: 48, borderRadius: 12 }}
              />
            </Col>

            <Col md={6}>
              <div
                style={{
                  padding: 20,
                  border: "1px solid #E5E7EB",
                  borderRadius: 18,
                  background: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 310,
                  overflow: "hidden",
                }}
              >
                <Calendar value={endDate} onChange={setEndDate} />
              </div>

              <Form.Label className="mt-3" style={{ fontWeight: 600 }}>
                Sampai
              </Form.Label>

              <Form.Control
                readOnly
                value={formatDate(endDate)}
                style={{ height: 48, borderRadius: 12 }}
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
                  `${formatDate(startDate)} - ${formatDate(endDate)}`
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
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setShowCalendar(false)}
          >
            <FaTimes size={14} color="#64748B" />
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Aktifkan Kembali */}
      <Modal
        show={showReActive}
        centered
        onHide={() => !reactivating && setShowReActive(false)}
      >
        <Modal.Body style={{ padding: 40, borderRadius: 20 }}>
          <h4 style={{ textAlign: "center", fontWeight: 700 }}>Konfirmasi</h4>

          <p
            style={{
              textAlign: "center",
              color: "#64748B",
              marginTop: 10,
              marginBottom: 35,
            }}
          >
            Apakah kamu yakin ingin mengaktifkan kembali kelas{" "}
            <strong>{selectedReActive?.nama_kelas}</strong>?
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
              onClick={handleReactivateKelas}
            >
              {reactivating ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "YA, AKTIFKAN DATA"
              )}
            </Button>

            <Button
              variant="outline-secondary"
              style={{ flex: 1, height: 46, borderRadius: 10 }}
              disabled={reactivating}
              onClick={() => setShowReActive(false)}
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

export default Kelas;