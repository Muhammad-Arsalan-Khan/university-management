import Navbar from "../navbar"
// function JDEODashboard() {
//   return (
//     <>
//      <Navbar />
//      <h1>JDEO Content</h1>
//     </>
//   )
// }

// export default JDEODashboard

// JuniorDataEntryOperatorDashboard.jsx
import React, { useEffect, useState } from "react"
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";

// config (as you asked)
const config = {
  baseURL: "http://localhost:5000/api",
};

// sidebar
const SIDEBAR = [
  "User",
  "Student",
  "Guardian",
  "Enrollment",
];

const showSuccess = (m) => Swal.fire({ icon: "success", title: "OK", text: m });
const showError = (m) => Swal.fire({ icon: "error", title: "Error", text: m });
const confirmDelete = (text = "Are you sure?") =>
  Swal.fire({ title: "Confirm", text, icon: "warning", showCancelButton: true }).then((r) => r.isConfirmed);

export default function JDEODashboard() {
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  // lookups
  const [studentsList, setStudentsList] = useState([]);

  // attendance control
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendanceSearchId, setAttendanceSearchId] = useState("");

  // generic GET helper
  const apiGet = (url) => axios.get(`${config.baseURL}${url.startsWith("/") ? url : "/" + url}`);

  // initial lookups
  useEffect(() => {
    fetchStudentsLookup();
  }, []);

  const fetchStudentsLookup = async () => {
    try {
      const res = await apiGet("/Student");
      const data = res.data.data || res.data || [];
      setStudentsList(data);
    } catch (e) {
      console.error("lookup error", e);
    }
  };

  // handle sidebar selection
  const handleSelect = (item) => {
    setActive(item);
    setRows([]);
    setColumns([]);
    setEditing(null);
    setForm({});
    if (item === "User") openUserList();
    else fetchModuleData(item);
  };

  // fetch per module
  const fetchModuleData = async (module) => {
    setLoading(true);
    try {
      let res;
      switch (module) {
        case "Student":
          res = await apiGet("/Student");
          processStudent(res.data.data || res.data || []);
          break;
        case "Guardian":
          res = await apiGet("/Guardian");
          processGuardian(res.data.data || res.data || []);
          break;
        case "Enrollment":
          res = await apiGet("/Enrollment");
          processEnrollment(res.data.data || res.data || []);
          break;
        case "StudentAttendance":
          res = await apiGet("/studentAttendance");
          processStudentAttendance(res.data.data || res.data || []);
          break;
        default:
          setRows([]);
          setColumns([]);
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || err.message || "Fetch failed");
      setRows([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  // User (create-only listing) - GET /getuser like before
  const openUserList = async () => {
    setLoading(true);
    try {
      const res = await apiGet("/getuser");
      const data = res.data.data || res.data || [];
      const processed = (data || []).map((u) => ({
        id: u._id,
        _id: u._id,
        name: u.Username || u.name || "",
        email: u.email,
      }));
      setColumns([
        { field: "_id", headerName: "_id", width: 260 },
        { field: "name", headerName: "Name", width: 220 },
        { field: "email", headerName: "Email", width: 260 },
      ]);
      setRows(processed);
    } catch (err) {
      console.error(err);
      showError("Failed to fetch users");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // processors
  const processStudent = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "fullName", headerName: "Name", width: 220 },
      { field: "email", headerName: "Email", width: 220 },
      { field: "gender", headerName: "Gender", width: 120 },
      { field: "department", headerName: "DepartmentId", width: 200 },
      { field: "admissionYear", headerName: "Admission Year", width: 150 },
      actionColumn(),
    ];
    const rows = data.map((s) => ({
      id: s._id,
      _id: s._id,
      fullName: s.fullName,
      email: s.email,
      gender: s.gender,
      department: s.departmentId ? (s.departmentId._id || s.departmentId) : "",
      admissionYear: s.admissionYear,
      raw: s,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processGuardian = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "studentId", headerName: "StudentId", width: 220 },
      { field: "name", headerName: "Name", width: 200 },
      { field: "relation", headerName: "Relation", width: 150 },
      { field: "phone", headerName: "Phone", width: 150 },
      actionColumn(),
    ];
    const rows = data.map((g) => ({
      id: g._id,
      _id: g._id,
      studentId: g.studentId?._id || g.studentId || "",
      name: g.name,
      relation: g.relation,
      phone: g.phone,
      raw: g,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processEnrollment = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "studentId", headerName: "StudentId", width: 240 },
      { field: "enrollmentDate", headerName: "Enrollment Date", width: 180 },
      { field: "status", headerName: "Status", width: 140 },
      actionColumn(),
    ];
    const rows = data.map((e) => ({
      id: e._id,
      _id: e._id,
      studentId: e.studentId?._id || e.studentId || "",
      enrollmentDate: e.enrollmentDate ? e.enrollmentDate.split("T")[0] : "",
      status: e.status,
      raw: e,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processStudentAttendance = (data) => {
    // filter by selected date by default
    const filtered = (data || []).filter((a) => (a.attendanceDate || "").split("T")[0] === attendanceDate);
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "studentId", headerName: "StudentId", width: 160 },
      { field: "status", headerName: "Status", width: 120 },
      { field: "attendanceDate", headerName: "Date", width: 140 },
      actionColumnAttendance(),
    ];
    const rows = filtered.map((a) => ({
      id: a._id,
      _id: a._id,
      studentId: a.enrollmentId?.studentId || a.studentId || "",
      status: a.status,
      attendanceDate: a.attendanceDate ? a.attendanceDate.split("T")[0] : "",
      raw: a,
    }));
    setColumns(cols);
    setRows(rows);
  };

  // action column
  const actionColumn = () => ({
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const row = params.row;
      return (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => openEditModal(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      );
    },
  });

  const actionColumnAttendance = () => ({
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const row = params.row;
      return (
        <Button variant="outlined" size="small" onClick={() => openEditModal(row)}>
          Edit
        </Button>
      );
    },
  });

  // open create/edit
  const openCreateModal = () => {
    setEditing(null);
    setForm(makeInitialFormFor(active, null));
    setOpenModal(true);
  };
  const openEditModal = (row) => {
    setEditing(row);
    setForm(makeInitialFormFor(active, row.raw || row));
    setOpenModal(true);
  };

  // initial form skeleton
  const makeInitialFormFor = (module, data) => {
    const d = data || {};
    switch (module) {
      case "Student":
        return {
          userId: d.userId?._id || d.userId || "",
          fullName: d.fullName || "",
          gender: d.gender || "",
          email: d.email || "",
          phone: d.phone || "",
          dob: d.dob ? d.dob.split("T")[0] : "",
          departmentId: d.departmentId?._id || d.departmentId || "",
          admissionYear: d.admissionYear || "",
          admissionDate: d.admissionDate ? d.admissionDate.split("T")[0] : "",
          status: d.status || "undergraduate",
          address: d.address || "",
          batch: d.batch || "",
        };
      case "Guardian":
        return {
          studentId: d.studentId?._id || d.studentId || "",
          name: d.name || "",
          relation: d.relation || "",
          phone: d.phone || "",
          address: d.address || "",
        };
      case "Enrollment":
        return {
          studentId: d.studentId?._id || d.studentId || "",
          enrollmentDate: d.enrollmentDate ? d.enrollmentDate.split("T")[0] : new Date().toISOString().split("T")[0],
          status: d.status || "active",
        };
      case "StudentAttendance":
        return {
          studentId: d.enrollmentId?.studentId || d.studentId || "",
          status: d.status || "present",
          attendanceDate: d.attendanceDate ? d.attendanceDate.split("T")[0] : attendanceDate,
        };
      case "User":
        return {
          Username: "",
          email: "",
          password: "",
          role: "Student", // fixed default
        };
      default:
        return {};
    }
  };

  // submit handler
  const handleSubmit = async () => {
    try {
      if (!active) return;
      if (editing) {
        const id = editing._id || editing.id;
        await handlePatch(active, id, form);
        showSuccess("Updated successfully");
      } else {
        await handlePost(active, form);
        showSuccess("Created successfully");
      }
      setOpenModal(false);
      setEditing(null);
      setForm({});
      if (active === "User") openUserList();
      else fetchModuleData(active);
      // refresh lookups if student list changed
      if (["Student", "Enrollment"].includes(active)) fetchStudentsLookup();
    } catch (err) {
      console.error("submit err", err);
      showError(err.response?.data?.message || err.message || "Operation failed");
    }
  };

  // POST handlers
  const handlePost = async (module, payload) => {
    switch (module) {
      case "Student":
        return axios.post(`${config.baseURL}/Student`, payload);
      case "Guardian":
        return axios.post(`${config.baseURL}/Guardian`, payload);
      case "Enrollment":
        return axios.post(`${config.baseURL}/Enrollment`, payload);
      case "StudentAttendance":
        return axios.post(`${config.baseURL}/studentAttendance`, payload);
      case "User":
        // signup with role = Student only
        return axios.post(`${config.baseURL}/signup`, {
          Username: payload.Username,
          email: payload.email,
          password: payload.password,
          role: "Student",
        });
      default:
        throw new Error("Unknown module for POST");
    }
  };

  // PATCH handlers
  const handlePatch = async (module, id, payload) => {
    switch (module) {
      case "Student":
        return axios.patch(`${config.baseURL}/Student/${id}`, payload);
      case "Guardian":
        return axios.patch(`${config.baseURL}/Guardian/${id}`, payload);
      case "Enrollment":
        return axios.patch(`${config.baseURL}/Enrollment/${id}`, payload);
      case "StudentAttendance":
        return axios.patch(`${config.baseURL}/studentAttendance/${id}`, payload);
      default:
        throw new Error("Unknown module for PATCH");
    }
  };

  // DELETE handler
  const handleDelete = async (row) => {
    const ok = await confirmDelete("Delete this record?");
    if (!ok) return;
    try {
      const id = row._id || row.id;
      switch (active) {
        case "Student":
          await axios.delete(`${config.baseURL}/Student/${id}`);
          break;
        case "Guardian":
          await axios.delete(`${config.baseURL}/Guardian/${id}`);
          break;
        case "Enrollment":
          await axios.delete(`${config.baseURL}/Enrollment/${id}`);
          break;
        case "StudentAttendance":
          await axios.delete(`${config.baseURL}/studentAttendance/${id}`);
          break;
        default:
          throw new Error("Delete not supported");
      }
      showSuccess("Deleted");
      fetchModuleData(active);
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  // Student attendance helpers: search and mark
  const handleAttendanceSearch = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/studentAttendance");
      const all = res.data.data || res.data || [];
      const filtered = all.filter((a) => (a.attendanceDate || "").split("T")[0] === attendanceDate);
      const byStudent = attendanceSearchId
        ? filtered.filter((a) => (a.enrollmentId?.studentId || a.studentId) === attendanceSearchId)
        : filtered;
      processStudentAttendance(byStudent.length ? byStudent : filtered);
    } catch (err) {
      console.error(err);
      showError("Attendance fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPresent = async () => {
    if (!attendanceSearchId) return showError("Enter studentId to mark attendance");
    try {
      // payload: { studentId, status, attendanceDate }
      await axios.post(`${config.baseURL}/studentAttendance`, {
        studentId: attendanceSearchId,
        status: "present",
        attendanceDate: attendanceDate,
      });
      showSuccess("Marked present");
      fetchModuleData("StudentAttendance");
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleAutoMark = async () => {
    try {
      await axios.post(`${config.baseURL}/studentAttendance/auto-mark`);
      showSuccess("Auto-mark requested");
      fetchModuleData("StudentAttendance");
    } catch (err) {
      console.error(err);
      showError("Auto mark failed");
    }
  };

  // render form fields based on module
  const renderFormFields = () => {
    switch (active) {
      case "Student":
        return (
          <>
            <TextField label="User ID" value={form.userId || ""} onChange={(e) => setForm((p) => ({ ...p, userId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Full Name" value={form.fullName || ""} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Gender" value={form.gender || ""} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Email" value={form.email || ""} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Phone" value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="DOB" type="date" value={form.dob || ""} onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }} />
            <TextField label="DepartmentId" value={form.departmentId || ""} onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Admission Year" value={form.admissionYear || ""} onChange={(e) => setForm((p) => ({ ...p, admissionYear: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Admission Date" type="date" value={form.admissionDate || ""} onChange={(e) => setForm((p) => ({ ...p, admissionDate: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }} />
            <TextField label="Status" value={form.status || ""} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Address" value={form.address || ""} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Batch" value={form.batch || ""} onChange={(e) => setForm((p) => ({ ...p, batch: e.target.value }))} fullWidth />
          </>
        );

      case "Guardian":
        return (
          <>
            <TextField label="StudentId" value={form.studentId || ""} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Name" value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Relation" value={form.relation || ""} onChange={(e) => setForm((p) => ({ ...p, relation: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Phone" value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Address" value={form.address || ""} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} fullWidth />
          </>
        );

      case "Enrollment":
        return (
          <>
            <TextField label="StudentId" value={form.studentId || ""} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Enrollment Date" type="date" value={form.enrollmentDate || ""} onChange={(e) => setForm((p) => ({ ...p, enrollmentDate: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }} />
            <TextField label="Status" value={form.status || ""} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} fullWidth />
          </>
        );

      case "StudentAttendance":
        return (
          <>
            <TextField label="StudentId" value={form.studentId || ""} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select value={form.status || "present"} label="Status" onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                {["present", "absent", "late", "excused"].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Attendance Date" type="date" value={form.attendanceDate || attendanceDate} onChange={(e) => setForm((p) => ({ ...p, attendanceDate: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
          </>
        );

      case "User":
        return (
          <>
            <TextField label="Username" value={form.Username || ""} onChange={(e) => setForm((p) => ({ ...p, Username: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Email" value={form.email || ""} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Password" type="password" value={form.password || ""} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Role" value={"Student"} disabled fullWidth />
          </>
        );

      default:
        return <Typography>No form configured</Typography>;
    }
  };

  // UI render
  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, bgcolor: "#0d1b2a", color: "white", p: 2 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>Junior Data Entry</Typography>
          <List>
            {SIDEBAR.map((s) => (
              <ListItemButton key={s} selected={active === s} onClick={() => handleSelect(s)}>
                <ListItemText primary={s} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Main */}
        <Box sx={{ flex: 1, p: 3, bgcolor: "#071226", color: "white" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">{active || "Select a module"}</Typography>
            <Stack direction="row" spacing={1}>
              {active === "" ? null : active === "User" ? (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setForm(makeInitialFormFor("User", null)); setOpenModal(true); }}>
                  Create Student User
                </Button>
              ) : active === "StudentAttendance" ? (
                <>
                  <TextField type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} size="small" sx={{ bgcolor: "white", borderRadius: 1 }} />
                  <TextField placeholder="studentId (enter manually)" value={attendanceSearchId} onChange={(e) => setAttendanceSearchId(e.target.value)} size="small" sx={{ bgcolor: "black", borderRadius: 1 }} />
                  <Button variant="contained" onClick={handleAttendanceSearch}>Search</Button>
                  <Button variant="contained" color="success" onClick={handleMarkPresent}>Mark Present</Button>
                  <Button variant="outlined" onClick={handleAutoMark}>Auto Mark</Button>
                </>
              ) : (
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>Create</Button>
              )}
            </Stack>
          </Stack>

          {/* Content */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress color="inherit" /></Box>
          ) : rows.length > 0 ? (
            <Box sx={{ height: "72vh", bgcolor: "white", borderRadius: 1 }}>
              <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Box>
          ) : (
            <Typography sx={{ mt: 6, color: "gray" }}>No data — pick a sidebar item</Typography>
          )}
        </Box>
      </Box>

      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? `Edit ${active}` : `Create ${active}`}</DialogTitle>
        <DialogContent dividers><Box sx={{ mt: 1 }}>{renderFormFields()}</Box></DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenModal(false); setEditing(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editing ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
