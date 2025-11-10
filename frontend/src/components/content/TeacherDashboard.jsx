// import Navbar from "../navbar"
// function TeacherDashboard() {
//   return (
//     <>
//     <Navbar />
//      <h1>Teacher dashboard</h1>
//     </>
//   )
// }

// export default TeacherDashboard
import React, { useEffect, useState } from "react";
import Navbar from "../navbar"; // adjust path if needed
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

// config
const config = {
  baseURL: "http://localhost:5000/api",
};

const SIDEBAR = ["StudentAttendance", "Assignment", "Result"];
const showSuccess = (m) => Swal.fire({ icon: "success", title: "OK", text: m });
const showError = (m) => Swal.fire({ icon: "error", title: "Error", text: m });
const confirmDelete = (text = "Are you sure?") =>
  Swal.fire({ title: "Confirm", text, icon: "warning", showCancelButton: true }).then((r) => r.isConfirmed);

export default function TeacherDashboard() {
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  // lookups
  const [studentsLookup, setStudentsLookup] = useState([]); // optional if needed
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [searchEnrollmentId, setSearchEnrollmentId] = useState("");

  // helpers
  const apiGet = (url) => axios.get(`${config.baseURL}${url.startsWith("/") ? url : "/" + url}`);

  useEffect(() => {
    // prefetch students (for convenience when showing names)
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await apiGet("/Student");
      const data = res.data.data || res.data || [];
      setStudentsLookup(data);
    } catch (e) {
      // ignore silently
    }
  };

  const handleSelect = (item) => {
    setActive(item);
    setRows([]);
    setColumns([]);
    setEditing(null);
    setForm({});
    fetchModuleData(item);
  };

  const fetchModuleData = async (module) => {
    setLoading(true);
    try {
      let res;
      switch (module) {
        case "StudentAttendance":
          res = await apiGet("/studentAttendance");
          processAttendance(res.data || res.data?.data || res.data);
          break;
        case "Assignment":
          res = await apiGet("/Assessment");
          processAssignment(res.data || res.data?.data || res.data);
          break;
        case "Result":
          res = await apiGet("/studentGrade");
          processResult(res.data || res.data?.data || res.data);
          break;
        default:
          setRows([]);
          setColumns([]);
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || err.message || "Failed to fetch");
      setRows([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  // processors
  const processAttendance = (data) => {
    const arr = Array.isArray(data) ? data : data.data || [];
    const filtered = arr.filter((a) => (a.attendanceDate || a.date || "").split("T")[0] === attendanceDate);
    const cols = [
      { field: "_id", headerName: "_id", width: 260 },
      { field: "enrollmentId", headerName: "EnrollmentId", width: 220 },
      { field: "studentId", headerName: "StudentId", width: 180 },
      { field: "status", headerName: "Status", width: 120 },
      { field: "attendanceDate", headerName: "Date", width: 140 },
      actionColumnAttendance(),
    ];
    const rows = filtered.map((r) => ({
      id: r._id,
      _id: r._id,
      enrollmentId: r.enrollmentId?._id || (r.enrollmentId || {}).toString(),
      studentId: r.enrollmentId?.studentId || r.studentId || "",
      status: r.status,
      attendanceDate: (r.attendanceDate || r.date || "").split("T")[0] || "",
      raw: r,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processAssignment = (data) => {
    const arr = Array.isArray(data) ? data : data.data || [];
    const cols = [
      { field: "_id", headerName: "_id", width: 260 },
      { field: "type", headerName: "Type", width: 140 },
      { field: "totalMarks", headerName: "Total", width: 110 },
      { field: "weightage", headerName: "Weightage", width: 110 },
      { field: "assessmentDate", headerName: "Date", width: 140 },
      { field: "fileURL", headerName: "File", width: 260 },
      actionColumn(),
    ];
    const rows = arr.map((a) => ({
      id: a._id,
      _id: a._id,
      type: a.type,
      totalMarks: a.totalMarks,
      weightage: a.weightage,
      assessmentDate: a.assessmentDate ? a.assessmentDate.split("T")[0] : "",
      fileURL: a.fileURL || "",
      raw: a,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processResult = (data) => {
    const arr = Array.isArray(data) ? data : data.data || [];
    const cols = [
      { field: "_id", headerName: "_id", width: 260 },
      { field: "studentId", headerName: "StudentId", width: 220 },
      { field: "gradeLetter", headerName: "Grade", width: 120 },
      { field: "gpa", headerName: "GPA", width: 110 },
      { field: "remarks", headerName: "Remarks", width: 220 },
      actionColumn(),
    ];
    const rows = arr.map((r) => ({
      id: r._id,
      _id: r._id,
      studentId: r.studentId?._id || r.studentId || "",
      gradeLetter: r.gradeLetter,
      gpa: r.gpa,
      remarks: r.remarks,
      raw: r,
    }));
    setColumns(cols);
    setRows(rows);
  };

  // action columns
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
    width: 160,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const row = params.row;
      return (
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" onClick={() => openEditModal(row)}>
            Edit
          </Button>
        </Stack>
      );
    },
  });

  // open modals
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

  const makeInitialFormFor = (module, data) => {
    const d = data || {};
    switch (module) {
      case "StudentAttendance":
        return {
          enrollmentId: d.enrollmentId?._id || d.enrollmentId || "",
          status: d.status || "present",
          attendanceDate: d.attendanceDate ? d.attendanceDate.split("T")[0] : attendanceDate,
        };
      case "Assignment":
        return {
          type: d.type || "assignment",
          totalMarks: d.totalMarks || "",
          weightage: d.weightage || "",
          assessmentDate: d.assessmentDate ? d.assessmentDate.split("T")[0] : "",
          programId: d.programId?._id || d.programId || "",
          semesterId: d.semesterId?._id || d.semesterId || "",
          file: null,
        };
      case "Result":
        return {
          studentId: d.studentId?._id || d.studentId || "",
          gradeLetter: d.gradeLetter || "",
          gpa: d.gpa || "",
          remarks: d.remarks || "",
        };
      default:
        return {};
    }
  };

  // submit handlers
  const handleSubmit = async () => {
    try {
      if (!active) return;
      if (editing) {
        const id = editing._id || editing.id;
        await handlePatch(active, id, form);
        showSuccess("Updated");
      } else {
        await handlePost(active, form);
        showSuccess("Created");
      }
      setOpenModal(false);
      setEditing(null);
      setForm({});
      fetchModuleData(active);
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || err.message || "Operation failed");
    }
  };

  const handlePost = async (module, payload) => {
    switch (module) {
      case "StudentAttendance":
        // payload needs: enrollmentId, status, attendanceDate
        return axios.post(`${config.baseURL}/studendAttendance` /* note: your endpoint spelling */ , payload);
      case "Assignment": {
        // file upload using FormData
        const fd = new FormData();
        fd.append("type", payload.type);
        fd.append("totalMarks", payload.totalMarks);
        fd.append("weightage", payload.weightage);
        fd.append("assessmentDate", payload.assessmentDate);
        if (payload.semesterId) fd.append("semesterId", payload.semesterId);
        if (payload.programId) fd.append("programId", payload.programId);
        if (payload.file) fd.append("file", payload.file);
        return axios.post(`${config.baseURL}/Assessment`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      case "Result":
        return axios.post(`${config.baseURL}/studentGrade`, payload);
      default:
        throw new Error("Unknown module for POST");
    }
  };

  const handlePatch = async (module, id, payload) => {
    switch (module) {
      case "StudentAttendance":
        return axios.patch(`${config.baseURL}/studendAttendance/${id}`, payload);
      case "Result":
        return axios.patch(`${config.baseURL}/studentGrade/${id}`, payload);
      default:
        throw new Error("Unknown module for PATCH");
    }
  };

  const handleDelete = async (row) => {
    const ok = await confirmDelete("Delete this record?");
    if (!ok) return;
    try {
      const id = row._id || row.id;
      switch (active) {
        case "StudentAttendance":
          await axios.delete(`${config.baseURL}/studendAttendance/${id}`);
          break;
        case "Assignment":
          await axios.delete(`${config.baseURL}/Assessment/${id}`);
          break;
        case "Result":
          await axios.delete(`${config.baseURL}/studentGrade/${id}`);
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

  // attendance helpers used by top bar
  const handleAttendanceSearch = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/studentAttendance");
      const all = res.data || res.data?.data || res;
      const arr = Array.isArray(all) ? all : all.data || [];
      const filtered = arr.filter((a) => (a.attendanceDate || a.date || "").split("T")[0] === attendanceDate);
      const byEnroll = searchEnrollmentId ? filtered.filter((a) => (a.enrollmentId?._id || a.enrollmentId) === searchEnrollmentId) : filtered;
      processAttendance(byEnroll.length ? byEnroll : filtered);
    } catch (err) {
      console.error(err);
      showError("Attendance fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPresent = async () => {
    if (!searchEnrollmentId) return showError("Enter enrollmentId to mark");
    try {
      await axios.post(`${config.baseURL}/studendAttendance`, {
        enrollmentId: searchEnrollmentId,
        status: "present",
        attendanceDate,
      });
      showSuccess("Marked present");
      fetchModuleData("StudentAttendance");
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Failed to mark");
    }
  };

  // render form fields depending on active
  const renderFormFields = () => {
    switch (active) {
      case "StudentAttendance":
        return (
          <>
            <TextField label="EnrollmentId" value={form.enrollmentId || ""} onChange={(e) => setForm((p) => ({ ...p, enrollmentId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select value={form.status || "present"} label="Status" onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                {["present", "absent", "late", "excused"].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Date" type="date" value={form.attendanceDate || attendanceDate} onChange={(e) => setForm((p) => ({ ...p, attendanceDate: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
          </>
        );

      case "Assignment":
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select value={form.type || "assignment"} label="Type" onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                <MenuItem value="assignment">assignment</MenuItem>
                <MenuItem value="quiz">quiz</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Total Marks" value={form.totalMarks || ""} onChange={(e) => setForm((p) => ({ ...p, totalMarks: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Weightage" value={form.weightage || ""} onChange={(e) => setForm((p) => ({ ...p, weightage: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Assessment Date" type="date" value={form.assessmentDate || ""} onChange={(e) => setForm((p) => ({ ...p, assessmentDate: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }} />
            <TextField label="ProgramId" value={form.programId || ""} onChange={(e) => setForm((p) => ({ ...p, programId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="SemesterId" value={form.semesterId || ""} onChange={(e) => setForm((p) => ({ ...p, semesterId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" component="label">Upload File<input hidden type="file" onChange={(e) => setForm((p) => ({ ...p, file: e.target.files[0] }))} /></Button>
          </>
        );

      case "Result":
        return (
          <>
            <TextField label="StudentId" value={form.studentId || ""} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Grade Letter" value={form.gradeLetter || ""} onChange={(e) => setForm((p) => ({ ...p, gradeLetter: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="GPA" type="number" value={form.gpa || ""} onChange={(e) => setForm((p) => ({ ...p, gpa: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Remarks" value={form.remarks || ""} onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} fullWidth />
          </>
        );

      default:
        return <Typography>No form configured</Typography>;
    }
  };

  // UI
  return (
    <Box>
      <Navbar />
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <Box sx={{ width: 240, bgcolor: "#0d1b2a", color: "white", p: 2 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>Teacher</Typography>
          <List>
            {SIDEBAR.map((s) => (
              <ListItemButton key={s} selected={active === s} onClick={() => handleSelect(s)}>
                <ListItemText primary={s} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, p: 3, bgcolor: "#071226", color: "white" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">{active || "Select a module"}</Typography>
            <Stack direction="row" spacing={1}>
              {active === "" ? null : active === "StudentAttendance" ? (
                <>
                  <TextField type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} size="small" sx={{ bgcolor: "white", borderRadius: 1 }} />
                  <TextField placeholder="enrollmentId" value={searchEnrollmentId} onChange={(e) => setSearchEnrollmentId(e.target.value)} size="small" sx={{ bgcolor: "black", borderRadius: 1 }} />
                  <Button variant="contained" onClick={handleAttendanceSearch}>Search</Button>
                  <Button variant="contained" color="success" onClick={handleMarkPresent}>Mark Present</Button>
                  <Button variant="outlined" onClick={async () => { try { await axios.post(`${config.baseURL}/studendAttendance/auto-mark`); showSuccess("Auto mark requested"); fetchModuleData("StudentAttendance"); } catch (e) { showError("Auto mark failed"); } }}>Auto Mark</Button>
                </>
              ) : (
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>Create</Button>
              )}
            </Stack>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress color="inherit" /></Box>
          ) : rows.length > 0 ? (
            <Box sx={{ height: "72vh", bgcolor: "white", borderRadius: 1 }}>
              <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Box>
          ) : (
            <Typography sx={{ mt: 6, color: "gray" }}>No data to display — click a sidebar item.</Typography>
          )}
        </Box>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? `Edit ${active}` : `Create ${active}`}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1 }}>{renderFormFields()}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenModal(false); setEditing(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editing ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
