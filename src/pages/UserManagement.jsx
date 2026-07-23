import { useState, useEffect } from "react";
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

// ===========================
// Default Users (FIX: sebelumnya variabel ini dipakai di UserManagement()
// tapi tidak pernah didefinisikan / di-import, sehingga menyebabkan
// error "defaultUsers is not defined")
// ===========================
const defaultUsers = [
  {
    id: 1,
    title: "Mr.",
    titleFull: "Mister",
    nama: "Ahmad Fauzi",
    phone: "081234567890",
    email: "ahmad.fauzi@example.com",
    tanggal: "12 Januari 1995",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    title: "Mrs.",
    titleFull: "Misess",
    nama: "Siti Rahayu",
    phone: "081298765432",
    email: "siti.rahayu@example.com",
    tanggal: "5 Mei 1998",
    role: "Member",
    status: "Active",
  },
  {
    id: 3,
    title: "Mr.",
    titleFull: "Mister",
    nama: "Budi Santoso",
    phone: "081345678901",
    email: "budi.santoso@example.com",
    tanggal: "20 Agustus 1990",
    role: "Member",
    status: "Non Active",
  },
];

// Simpan data default ke localStorage hanya sekali
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

function UserManagement() {

  const navigate = useNavigate();

  // ===========================
  // Pagination
  // ===========================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ===========================
  // Calendar
  // ===========================
  const [calendarMode, setCalendarMode] = useState("filter");

  const formatDate = (date) =>
    date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const [startDate, setStartDate] = useState(new Date(2023, 3, 4));
  const [endDate, setEndDate] = useState(new Date(2023, 6, 16));

  const [showCalendar, setShowCalendar] = useState(false);

  const [dateRange, setDateRange] = useState(
    "4 April 2023 - 16 Juli 2023"
  );

  // ===========================
  // Re Active
  // ===========================
  const [showReActive, setShowReActive] = useState(false);
  const [selectedReActive, setSelectedReActive] = useState(null);

// ===========================
// Users
// ===========================
const [dataUsers, setDataUsers] = useState(() => {
  return JSON.parse(localStorage.getItem("users")) || [];
});

useEffect(() => {
  localStorage.setItem("users", JSON.stringify(dataUsers));
}, [dataUsers]);

  // ===========================
  // Delete
  // ===========================
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [reason, setReason] = useState("");

  // ===========================
  // Search
  // ===========================
  const [search, setSearch] = useState("");

  // ===========================
  // Active / Non Active Tab
  // ===========================
  const [tab, setTab] = useState(() => {
    return localStorage.getItem("userTab") || "active";
  });

  useEffect(() => {
    localStorage.setItem("userTab", tab);
  }, [tab]);

  // ===========================
  // Detail
  // ===========================
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const isSearching = search.trim() !== "";

  // ===========================
  // Filter Data
  // ===========================
  const filteredUsers = dataUsers
    .filter((item) =>
      tab === "active"
        ? item.status === "Active"
        : item.status === "Non Active"
    )
    .filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.nama.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.phone.toLowerCase().includes(keyword)
      );
    });

  // ===========================
  // Pagination
  // ===========================
  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, search]);

  console.log(tab);

  return (
    <Container fluid>
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

          <p style={{ color: "#64748B" }}>
            Kelola seluruh data pengguna LMS.
          </p>
        </div>
      </div>

      {/* Statistik */}
     <Row className="g-4 mb-4">
  {/* Total Member */}
  <Col md={6}>
    <Card
      style={{
        border: "none",
        borderRadius: "16px",
        background: "#EAF5FF",
        minHeight: "120px", 
        boxShadow: "0 4px 18px rgba(15,23,42,.04)",
      }}
    >
      <Card.Body className="px-4 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div
              className="d-flex align-items-center gap-2"
              style={{
                fontSize: "13px",
                color: "#4B5563",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Total Member
              <FaInfoCircle
                size={12}
                color="#9CA3AF"
                style={{ cursor: "pointer" }}
              />
            </div>

            <h2
              style={{
                marginTop: 4,
                marginBottom: 0,
                fontSize: "42px",
                fontWeight: "700",
                color: "#1F2937",
              }}
            >

{dataUsers.filter(
item=>item.status==="Active"
).length}
            </h2>
          </div>

          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "#D6ECFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaUsers size={28} color="#2563EB" />
          </div>
        </div>
      </Card.Body>
    </Card>
  </Col>

  {/* Member Baru */}
  <Col md={6}>
    <Card
      style={{
        border: "none",
        borderRadius: "16px",
        background: "#FFF5DA",
        minHeight: "120px", 
        boxShadow: "0 4px 18px rgba(15,23,42,.04)",
      }}
    >
      <Card.Body className="px-4 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
  <div
    className="d-flex align-items-center gap-2"
    style={{
      fontSize: "13px",
      color: "#4B5563",
      fontWeight: 600,
      textTransform: "uppercase",
    }}
  >
    Member Baru
    <FaInfoCircle
      size={12}
      color="#9CA3AF"
    />
  </div>

  <h2>18</h2>

  <small
    style={{
      color: "#6B7280",
      fontSize: "12px",
    }}
  >
    90 hari terakhir (4 April - 4 Juli 2023)
  </small>
</div>

          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "#DCFCE7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaUserPlus size={28} color="#16A34A" />
          </div>
        </div>
      </Card.Body>
    </Card>
  </Col>
</Row>

      {/* Card */}
      <Card
        style={{
          border: "none",
          borderRadius: 16,
          minHeight: "120px",
          boxShadow: "0 5px 20px rgba(0,0,0,.05)",
        }}
      >
        <Card.Body>
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
cursor:"pointer",
fontWeight:600,
paddingBottom:10,
borderBottom:
tab==="active"
? "3px solid #2538C8"
: "none",
color:
tab==="active"
? "#2538C8"
: "#64748B"
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
              }}
            >
              Non Active
            </p>
          </div>

          {/* Search */}
          <Row className="align-items-center mb-4">
  <Col md={4}>
    <InputGroup
  style={{
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
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
  onChange={(e) => setSearch(e.target.value)}
 style={{
    borderLeft:"none",
    height:52,
    fontSize:16,
padding:"22px 18px",
fontWeight:500,
    boxShadow:"none",
    borderColor:"#E2E8F0"
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
      onClick={() => navigate("/user-management/tambah")}
      style={{
background:"#2538C8",
border:"none",
height:52,
padding:"0 26px",
borderRadius:14,
fontWeight:600,
boxShadow:"0 6px 18px rgba(37,56,200,.25)"
}}
    >
      <FaPlus className="me-2"/>
      Buat User Baru
    </Button>
  </Col>
</Row>

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
  
  <tr
style={{
transition:".2s"
}}
onMouseEnter={(e)=>{
e.currentTarget.style.background="#F8FAFC";
}}
onMouseLeave={(e)=>{
e.currentTarget.style.background="#fff";
}}
>

 <th
style={{
fontSize:15,
padding:"22px 18px",
fontWeight:600,
color:"#64748B",
borderBottom:"1px solid #E2E8F0",
letterSpacing:".5px"
}}
>
NO.
</th>

  <th
    style={{
      padding: "18px 16px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      borderBottom: "1px solid #E2E8F0",
      letterSpacing: ".5px"
    }}
  >
    TITLE
  </th>

  <th
    style={{
      padding: "18px 16px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      borderBottom: "1px solid #E2E8F0",
      letterSpacing: ".5px"
    }}>NAMA</th>

  <th
    style={{
      padding: "18px 16px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      borderBottom: "1px solid #E2E8F0",
      letterSpacing: ".5px"
    }}
  >
    NO. HANDPHONE
  </th>

  <th
     style={{
      padding: "18px 16px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      borderBottom: "1px solid #E2E8F0",
      letterSpacing: ".5px"
    }}>
      EMAIL
      </th>

  <th
     style={{
      padding: "18px 16px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      borderBottom: "1px solid #E2E8F0",
      letterSpacing: ".5px"
    }}>
      TANGGAL LAHIR
    </th>

  <th
     style={{
      padding: "18px 16px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      borderBottom: "1px solid #E2E8F0",
      letterSpacing: ".5px"
    }}>
      ROLES
      </th>

  <th></th>

   </tr>
</thead>

            <tbody>
  {filteredUsers.length > 0 ? (
    currentUsers.map((item, index) => (
      <tr key={item.id}>
        <td
          style={{
            padding: "18px 16px",
            verticalAlign: "middle",
            fontSize: 14,
            color: "#334155",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          {index + 1}
        </td>

        <td
          style={{
            padding: "18px 16px",
            verticalAlign: "middle",
            fontSize: 14,
            color: "#334155",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          {item.title}
        </td>

        <td
          style={{
            padding: "18px 16px",
            verticalAlign: "middle",
            fontSize: 14,
            color: "#334155",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          {item.nama}
        </td>

        <td
          style={{
            padding: "18px 16px",
            verticalAlign: "middle",
            fontSize: 14,
            color: "#334155",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          {item.phone}
        </td>

        <td
          style={{
            padding: "18px 16px",
            verticalAlign: "middle",
            fontSize: 14,
            color: "#334155",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          {item.email}
        </td>

        <td
          style={{
            padding: "18px 16px",
            verticalAlign: "middle",
            fontSize: 14,
            color: "#334155",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          {item.tanggal}
        </td>

        <td
          style={{
            padding: "18px 16px",
            verticalAlign: "middle",
            fontSize: 14,
            color: "#334155",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          {item.role}
        </td>

        <td>
          <div
            style={{
              display: "flex",
              gap:24,
              justifyContent: "center",
            }}
          >
            {tab === "active" ? (
              <span
                onClick={() => {
                  setSelectedUser(item);
                  setShowDetail(true);
                }}
                style={{ cursor: "pointer" }}
              >
<FaEye
    size={20}
    color="#6B7280"
/>
              </span>
            ) : (
              <span
                size="sm"
                variant="warning"
                title="Re Active"
              >
         <FaArrowCircleUp
  style={{
fontSize:22,
cursor:"pointer",
color:"#2563EB",
    transition: ".2s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "#2538C8";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = "#6B7280";
  }}
  onClick={() => {
    setSelectedReActive(item);
    setCalendarMode("reactive");
    setShowCalendar(true);
  }}
/>
              </span>
            )}

            <span
              size="sm"
              variant="light"
              onClick={() =>
                navigate(`/user-management/edit/${user.id}`)
              }
            >
<FaEdit
style={{
fontSize:20,
color:"#6B7280",
cursor:"pointer"
}}
/>
            </span>

            <span
              onClick={() => {
                setSelectedDelete(item);
                setShowDelete(true);
              }}
              size="sm"
              variant="light"
            >
          <FaTrash
style={{
fontSize:20,
color:"#EF4444",
cursor:"pointer"
}}
/>
            </span>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={8}
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
            : "Belum ada data pengguna"}
        </h5>

        <p
          style={{
            color: "#94A3B8",
            marginBottom: 20,
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
          <div className="d-flex justify-content-center mt-4">

<Pagination>

<Pagination.First
onClick={() => setCurrentPage(1)}
disabled={currentPage === 1}
/>

<Pagination.Prev
onClick={() => setCurrentPage(currentPage - 1)}
disabled={currentPage === 1}
/>

{[...Array(totalPages)].map((_, index) => (
  <Pagination.Item
    key={index}
    active={currentPage === index + 1}
    onClick={() => setCurrentPage(index + 1)}
  >
    {index + 1}
  </Pagination.Item>
))}

<Pagination.Next
onClick={() => setCurrentPage(currentPage + 1)}
disabled={currentPage === totalPages}
/>

<Pagination.Last
onClick={() => setCurrentPage(totalPages)}
disabled={currentPage === totalPages}
/>

</Pagination>
</div>
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
padding:"36px",
borderRadius:18
}}
>

<h2
style={{
fontWeight:700,
textAlign:"center",
marginBottom:30
}}
>
Detail Data User
</h2>

<Row className="mb-3">

<Col xs={5}>Title</Col>

<Col xs={7} className="text-end">
{selectedUser?.titleFull}
</Col>

</Row>

<Row className="mb-3">

<Col xs={5}>Nama</Col>

<Col xs={7} className="text-end">
{selectedUser?.nama}
</Col>

</Row>

<Row className="mb-3">

<Col xs={5}>No. Handphone</Col>

<Col xs={7} className="text-end">
{selectedUser?.phone}
</Col>

</Row>

<Row className="mb-3">

<Col xs={5}>Email</Col>

<Col xs={7} className="text-end">
{selectedUser?.email}
</Col>

</Row>

<Row className="mb-3">

<Col xs={5}>Tanggal Lahir</Col>

<Col xs={7} className="text-end">
{selectedUser?.tanggal}
</Col>

</Row>

<Row>

<Col xs={5}>Roles</Col>

<Col xs={7} className="text-end">
{selectedUser?.role}
</Col>

</Row>

</Modal.Body>
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
    transition: ".2s",
  }}
  onClick={() => setShowDetail(false)}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#E2E8F0";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#F1F5F9";
  }}
>
  <FaTimes
    size={14}
    color="#64748B"
  />
</div>
</Modal>

{/* Modal Hapus */}
<Modal
show={showDelete}
onHide={() => setShowDelete(false)}
centered
>

<Modal.Body
style={{
padding:"36px",
borderRadius:18
}}
>

<h3
style={{
fontWeight:700,
textAlign:"center"
}}
>
Konfirmasi
</h3>

<p
style={{
textAlign:"center",
marginTop:10,
marginBottom:25,
color:"#64748B"
}}
>

Apakah kamu yakin menghapus data ini?

Berikan alasan!

</p>

<Form.Control

as="textarea"

rows={4}

placeholder="Tulis di sini"

maxLength={300}

value={reason}

onChange={(e)=>setReason(e.target.value)}

/>

<div
className="d-flex justify-content-between mt-4"
>

<Button
style={{
  width: "48%",
  height: 46,
  background: "#2538C8",
  border: "none",
  borderRadius: 10,
}}
onClick={() => {
  if (!selectedDelete) return;

  setDataUsers(
    dataUsers.filter(item => item.id !== selectedDelete.id)
  );

  setShowDelete(false);
  setSelectedDelete(null);
  setReason("");
}}
>
  YA, HAPUS DATA
</Button>

<Button

variant="outline-secondary"

style={{

width:"48%",

height:46,

borderRadius:10

}}

onClick={()=>setShowDelete(false)}

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
    style={{
      padding: 35,
      borderRadius: 20,
      position: "relative",
    }}
  >
    <h3
      style={{
        textAlign: "center",
        fontWeight: 700,
        marginBottom: 30,
        color: "#1E293B",
      }}
    >
      Filter Tanggal
    </h3>

    <Row className="g-4">

      <Col md={6}>
        <div
  style={{
    padding:20,
    border:"1px solid #E5E7EB",
    borderRadius:18,
    background:"#fff",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    minHeight:310,
    overflow:"hidden",
  }}
>
          <Calendar
    value={startDate}
    onChange={setStartDate}
/>
        </div>

        <Form.Label
          className="mt-3"
          style={{ fontWeight: 600 }}
        >
          Dari
        </Form.Label>

        <Form.Control
    readOnly
    value={startDate.toLocaleDateString("id-ID",{
        day:"numeric",
        month:"long",
        year:"numeric"
    })}
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
    <Calendar
      value={endDate}
      onChange={setEndDate}
    />
  </div>

  <Form.Label
    className="mt-3"
    style={{ fontWeight: 600 }}
  >
    Sampai
  </Form.Label>

  <Form.Control
    readOnly
    value={formatDate(endDate)}
    style={{
      height:48,
      borderRadius:12
    }}
  />
</Col>

    </Row>

    <div
    className="d-flex justify-content-end align-items-center mt-4"
>
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
  console.log("calendarMode =", calendarMode);
  console.log("selected =", selectedReActive);

  setDateRange(
    `${formatDate(startDate)} - ${formatDate(endDate)}`
  );

  setShowCalendar(false);

  if (calendarMode === "reactive") {
    console.log("Buka Modal Konfirmasi");
    setShowReActive(true);
  }
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
      <FaTimes
        size={14}
        color="#64748B"
      />
    </div>
  </Modal.Body>
</Modal>

{/* Modal Konfirmasi */}

<Modal
    show={showReActive}
    centered
    onHide={()=>setShowReActive(false)}
>
    <Modal.Body
        style={{
            padding:40,
            borderRadius:20,
            position:"relative"
        }}
    >content://media/external/downloads/28179

        <h3
            style={{
                textAlign:"center",
                fontWeight:700
            }}
        >
            Konfirmasi
        </h3>

        <p
            style={{
                textAlign:"center",
                color:"#64748B",
                marginTop:10,
                marginBottom:35
            }}
        >
            Apakah kamu yakin ingin mengaktifkan kembali data ini?
        </p>

        <div className="d-flex gap-3">

            <Button
                style={{
                    flex:1,
                    background:"#2538C8",
                    border:"none",
                    height:46,
                    borderRadius:10
                }}
                onClick={() => {
  if (!selectedReActive) return;

  setDataUsers((prev) =>
    prev.map((user) =>
      user.id === selectedReActive.id
        ? {
            ...user,
            status: "Active",
          }
        : user
    )
  );

  setShowReActive(false);
  setSelectedReActive(null);
  setShowCalendar(false);

  // pindah ke tab Active
  setTab("active");
}}
            >
                YA, AKTIFKAN DATA
            </Button>

            <Button
                variant="outline-secondary"
                style={{
                    flex:1,
                    height:46,
                    borderRadius:10
                }}
                onClick={()=>setShowReActive(false)}
            >
                TIDAK, KEMBALI
            </Button>

        </div>

    </Modal.Body>
</Modal>

    </Container>
  );
}

export default UserManagement;
