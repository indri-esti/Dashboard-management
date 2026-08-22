import { useState, useEffect } from "react";
import api from "../api";
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
  FaCalendarAlt,
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowCircleUp,
  FaTimes,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const isActiveStatus = (status) =>
  (status || "").toLowerCase().trim() === "active";

function Roles() {
  // ===========================
  // Data roles (HARDCODE sementara)
  // ===========================
  const [dataRoles, setDataRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/roles");

      if (response.data?.status === "success") {
        const roles = (response.data.data || []).map((item) => ({
          ...item,
          // Backend role.py saat ini hanya mengembalikan
          // id_role, nama_role, dan deskripsi.
          // Karena itu data master dari API dianggap active.
          status: item.status || "active",
          created_at: item.created_at || null,
          alasan_non_active: item.alasan_non_active || "",
        }));

        setDataRoles(roles);
      } else {
        setDataRoles([]);
        setError(
          response.data?.message || "Gagal mengambil data roles."
        );
      }
    } catch (err) {
      console.error("Gagal mengambil data roles:", err);
      setDataRoles([]);
      setError(
        err.response?.data?.message ||
          "Gagal mengambil data roles dari server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
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

  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), 0, 1);

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
    return localStorage.getItem("rolesTab") || "active";
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, search]);

  useEffect(() => {
    localStorage.setItem("rolesTab", tab);
  }, [tab]);

  // ===========================
  // Detail modal
  // ===========================
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // ===========================
  // Add modal
  // ===========================
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    nama_role: "",
    deskripsi: "",
  });
  const [adding, setAdding] = useState(false);

  const openAddModal = () => {
    setAddForm({ nama_role: "", deskripsi: "" });
    setShowAdd(true);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAdd = () => {
    if (!addForm.nama_role.trim()) return;

    setAdding(true);

    // Simulasi tambah data lokal (nanti diganti api.post("/api/roles", addForm))
    setTimeout(() => {
      setDataRoles((prev) => {
        const nextId =
          prev.length > 0
            ? Math.max(...prev.map((item) => Number(item.id_role) || 0)) + 1
            : 1;

        return [
          ...prev,
          {
            id_role: nextId,
            nama_role: addForm.nama_role,
            deskripsi: addForm.deskripsi,
            status: "active",
            created_at: new Date().toISOString().slice(0, 10),
            alasan_non_active: "",
          },
        ];
      });

      setShowAdd(false);
      setAdding(false);
      setTab("active");
    }, 300);
  };

  // ===========================
  // Edit modal
  // ===========================
  const [showEdit, setShowEdit] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    nama_role: "",
    deskripsi: "",
    alasan_non_active: "",
  });
  const [saving, setSaving] = useState(false);

  const openEditModal = (item) => {
    setSelectedEdit(item);
    setEditForm({
      nama_role: item.nama_role || "",
      deskripsi: item.deskripsi || "",
      alasan_non_active: item.alasan_non_active || "",
    });
    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    if (!selectedEdit) return;

    setSaving(true);

    const alasanTerisi = editForm.alasan_non_active.trim() !== "";

    // Simulasi update data lokal (nanti diganti api.put(`/api/roles/${id}`, editForm))
    setTimeout(() => {
      setDataRoles((prev) =>
        prev.map((item) =>
          item.id_role === selectedEdit.id_role
            ? {
                ...item,
                ...editForm,
                status: alasanTerisi ? "non active" : "active",
              }
            : item
        )
      );

      setShowEdit(false);
      setSelectedEdit(null);
      setSaving(false);
    }, 300);
  };

  // ===========================
  // Delete modal (HAPUS PERMANEN)
  // ===========================
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRole = () => {
    if (!selectedDelete) return;

    setDeleting(true);

    // Simulasi hapus data lokal (nanti diganti api.delete(`/api/roles/${id}`))
    setTimeout(() => {
      setDataRoles((prev) =>
        prev.filter((item) => item.id_role !== selectedDelete.id_role)
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

  const handleReactivateRole = () => {
    if (!selectedReActive) return;

    setReactivating(true);

    // Simulasi reaktivasi data lokal (nanti diganti api.put(`/api/roles/${id}/reactivate`))
    setTimeout(() => {
      setDataRoles((prev) =>
        prev.map((item) =>
          item.id_role === selectedReActive.id_role
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
  const filteredRoles = dataRoles
    .filter((item) =>
      tab === "active"
        ? isActiveStatus(item.status)
        : !isActiveStatus(item.status)
    )
    .filter((item) => {
      const keyword = search.toLowerCase();

      return (
        (item.nama_role || "").toLowerCase().includes(keyword) ||
        (item.deskripsi || "").toLowerCase().includes(keyword)
      );
    })
    .filter((item) => {
      // Endpoint /api/roles saat ini tidak mengirim created_at.
      // Kalau tanggal tidak tersedia, jangan sembunyikan role.
      if (!item.created_at) return true;

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

      return Number(b.id_role || 0) - Number(a.id_role || 0);
    });

  // ===========================
  // Pagination
  // ===========================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRoles.length / itemsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastRole = currentPage * itemsPerPage;
  const indexOfFirstRole = indexOfLastRole - itemsPerPage;

  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  return (
    <Container fluid className="py-3 roles-page">
      <style>{`
        .roles-page {
          --um-primary: #4f46e5;
          --um-text: #0f172a;
          --um-muted: #64748b;
          --um-border: #e8edf5;
          color: var(--um-text);
        }

        .roles-page .card {
          border-color: var(--um-border) !important;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.055) !important;
        }

        .roles-page .table-responsive {
          border: 1px solid var(--um-border);
          border-radius: 16px;
          overflow-x: auto;
          background: #fff;
        }

        .roles-page table {
          min-width: 700px;
        }

        .roles-page table th {
          background: #f8fafc !important;
          color: #94a3b8 !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          letter-spacing: .8px !important;
          padding: 15px 16px !important;
          white-space: nowrap;
          border-bottom: 1px solid var(--um-border) !important;
        }

        .roles-page table td {
          padding: 16px !important;
          font-size: 13px !important;
          color: #475569 !important;
          border-bottom: 1px solid #f0f3f8 !important;
          vertical-align: middle;
        }

        .roles-page table tbody tr:hover {
          background: #fafbff !important;
        }

        .roles-page table td:last-child span {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          transition: all .18s ease;
        }

        .roles-page table td:last-child span:hover {
          background: #eef2ff;
          transform: translateY(-1px);
        }

        .roles-page .pagination .page-link {
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

        .roles-page .pagination .page-item.active .page-link {
          background: #4f46e5 !important;
          border-color: #4f46e5 !important;
          color: #fff !important;
        }

        .roles-page .modal-content {
          border: 1px solid var(--um-border) !important;
          border-radius: 22px !important;
          box-shadow: 0 24px 70px rgba(15,23,42,.18) !important;
          overflow: hidden;
        }

        @media (max-width: 767.98px) {
          .roles-page .table-responsive {
            border-radius: 13px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: "#1E293B" }}>Roles</h2>
          <p style={{ color: "#64748B", marginBottom: 0 }}>
            Kelola data master roles/hak akses LMS.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

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
                borderBottom: tab === "active" ? "3px solid #2538C8" : "none",
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
                  placeholder="Cari role..."
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
                onClick={openAddModal}
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
                Tambah Role
              </Button>
            </Col>
          </Row>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#2538C8" }} />
              <p className="mt-3" style={{ color: "#64748B" }}>
                Memuat data roles...
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
                    <th style={thStyle}>NAMA ROLE</th>
                    <th style={thStyle}>DESKRIPSI</th>

                    {tab === "nonactive" && <th style={thStyle}>ALASAN</th>}

                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRoles.length > 0 ? (
                    currentRoles.map((item, index) => (
                      <tr key={item.id_role ?? index}>
                        <td style={tdStyle}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        <td>
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
                            {item.nama_role}
                          </Badge>
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            maxWidth: 320,
                            minWidth: 180,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.deskripsi || "-"}
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
                                  setSelectedRole(item);
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
                              onClick={() => openEditModal(item)}
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
                        colSpan={tab === "nonactive" ? 5 : 4}
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
                            : "Belum ada data role"}
                        </h5>

                        <p style={{ color: "#94A3B8", marginBottom: 20 }}>
                          {isSearching
                            ? "Coba gunakan kata kunci lain."
                            : "Data role akan ditampilkan di sini."}
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

              {filteredRoles.length > 0 && (
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
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
            Detail Role
          </h4>

          <Row className="mb-3">
            <Col xs={5}>Nama Role</Col>
            <Col xs={7} className="text-end">
              {selectedRole?.nama_role || "-"}
            </Col>
          </Row>

          <Row>
            <Col xs={5}>Deskripsi</Col>
            <Col xs={7} className="text-end">
              {selectedRole?.deskripsi || "-"}
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

      {/* Modal Tambah */}
      <Modal
        show={showAdd}
        onHide={() => !adding && setShowAdd(false)}
        centered
      >
        <Modal.Body
          style={{ padding: "36px", borderRadius: 18, position: "relative" }}
        >
          <h4 style={{ fontWeight: 700, textAlign: "center", marginBottom: 30 }}>
            Tambah Role
          </h4>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Nama Role</Form.Label>
              <Form.Control
                name="nama_role"
                value={addForm.nama_role}
                onChange={handleAddChange}
                placeholder="Masukkan nama role"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label style={{ fontWeight: 600 }}>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="deskripsi"
                value={addForm.deskripsi}
                onChange={handleAddChange}
                placeholder="Masukkan deskripsi role"
              />
            </Form.Group>
          </Form>

          <div className="d-flex justify-content-between mt-4">
            <Button
              style={{
                width: "48%",
                height: 46,
                background: "#2538C8",
                border: "none",
                borderRadius: 10,
              }}
              disabled={adding || !addForm.nama_role.trim()}
              onClick={handleSaveAdd}
            >
              {adding ? <Spinner animation="border" size="sm" /> : "SIMPAN"}
            </Button>

            <Button
              variant="outline-secondary"
              style={{ width: "48%", height: 46, borderRadius: 10 }}
              disabled={adding}
              onClick={() => setShowAdd(false)}
            >
              BATAL
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
            onClick={() => !adding && setShowAdd(false)}
          >
            <FaTimes size={14} color="#64748B" />
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Edit */}
      <Modal
        show={showEdit}
        onHide={() => !saving && setShowEdit(false)}
        centered
      >
        <Modal.Body
          style={{ padding: "36px", borderRadius: 18, position: "relative" }}
        >
          <h4 style={{ fontWeight: 700, textAlign: "center", marginBottom: 30 }}>
            Edit Role
          </h4>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Nama Role</Form.Label>
              <Form.Control
                name="nama_role"
                value={editForm.nama_role}
                onChange={handleEditChange}
                placeholder="Masukkan nama role"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="deskripsi"
                value={editForm.deskripsi}
                onChange={handleEditChange}
                placeholder="Masukkan deskripsi role"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label style={{ fontWeight: 600 }}>
                Alasan Non Active
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="alasan_non_active"
                value={editForm.alasan_non_active}
                onChange={handleEditChange}
                placeholder="Kosongkan jika tetap active..."
              />
              <Form.Text style={{ color: "#94A3B8" }}>
                Kalau alasan diisi, status otomatis jadi Non Active. Kalau
                dikosongkan, status otomatis jadi Active.
              </Form.Text>
            </Form.Group>
          </Form>

          <div className="d-flex justify-content-between mt-4">
            <Button
              style={{
                width: "48%",
                height: 46,
                background: "#2538C8",
                border: "none",
                borderRadius: 10,
              }}
              disabled={saving}
              onClick={handleSaveEdit}
            >
              {saving ? <Spinner animation="border" size="sm" /> : "SIMPAN"}
            </Button>

            <Button
              variant="outline-secondary"
              style={{ width: "48%", height: 46, borderRadius: 10 }}
              disabled={saving}
              onClick={() => {
                setShowEdit(false);
                setSelectedEdit(null);
              }}
            >
              BATAL
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
            onClick={() => !saving && setShowEdit(false)}
          >
            <FaTimes size={14} color="#64748B" />
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Hapus Role (permanen) */}
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
            Apakah kamu yakin ingin menghapus role{" "}
            <strong>{selectedDelete?.nama_role}</strong>? Data yang sudah
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
              onClick={handleDeleteRole}
            >
              {deleting ? <Spinner animation="border" size="sm" /> : "YA, HAPUS"}
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
            Apakah kamu yakin ingin mengaktifkan kembali{" "}
            <strong>{selectedReActive?.nama_role}</strong>?
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
              onClick={handleReactivateRole}
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

export default Roles;