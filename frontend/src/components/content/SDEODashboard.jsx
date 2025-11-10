import Navbar from "../navbar";
// function SDEODashboard() {
//   return (
//     <>
//     <Navbar />
//      <h1>SDEODashboard Content</h1>
//     </>
//   )
// }

// export default SDEODashboard
import React, { useEffect, useState, useMemo } from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Swal from "sweetalert2";

// === config (user asked to define like this) ===
const config = {
  baseURL: "http://localhost:5000/api",
};

// === sidebar items ===
const SIDEBAR = [
  "Teacher",
  "Staff",
  "User",
  "Department",
  "Program",
  "Course",
  "Semester",
  "StaffAttendance",
];

// === roles used for user create ===
const USER_ROLES = [
  "SeniorDataEntryOperator",
  "JuniorDataEntryOperator",
  "feeOprator",
  "Librarian",
  "LabIncharge",
  "Teacher",
  "Student",
  "other",
];

// Helper: show success/error
const showSuccess = (msg) =>
  Swal.fire({ icon: "success", title: "Success", text: msg });
const showError = (msg) =>
  Swal.fire({ icon: "error", title: "Error", text: msg });
const confirmDelete = (text = "Are you sure?") =>
  Swal.fire({
    title: "Confirm",
    text,
    icon: "warning",
    showCancelButton: true,
  }).then((r) => r.isConfirmed);

export default function SDEODashboard() {
  const [active, setActive] = useState(""); // current module
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null); // object when editing
  const [form, setForm] = useState({}); // dynamic form state

  // Cache lists used for selects (departments, staff etc.)
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Attendance search
  const [attendanceDate, setAttendanceDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [attendanceSearchId, setAttendanceSearchId] = useState("");

  // Helper: generic GET
  const apiGet = async (url) =>
    axios.get(`${config.baseURL}${url.startsWith("/") ? url : "/" + url}`);

  // Fetch lookups
  const fetchLookups = async () => {
    try {
      const [dRes, sRes] = await Promise.allSettled([
        apiGet("/depart"),
        apiGet("/staff"),
      ]);
      if (dRes.status === "fulfilled")
        setDepartments(dRes.value.data.data || dRes.value.data || []);
      if (sRes.status === "fulfilled")
        setStaffList(sRes.value.data.data || sRes.value.data || []);
    } catch (e) {
      // ignore - optional
      console.error("lookup fetch error", e);
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  // when user clicks a sidebar item
  const handleSelect = (item) => {
    setActive(item);
    setRows([]);
    setColumns([]);
    setEditing(null);
    setForm({});
    if (item === "User") {
      openUserList();
    } else {
      fetchModuleData(item);
    }
  };

  // ============================
  // FETCH + PROCESS FOR EACH MODULE
  // ============================
  const fetchModuleData = async (module) => {
    setLoading(true);
    try {
      let res;
      switch (module) {
        case "Teacher":
          res = await apiGet("/teacher");
          processTeacher(res.data.data || res.data || []);
          break;
        case "Staff":
          res = await apiGet("/staff");
          processStaff(res.data.data || res.data || []);
          break;
        case "Department":
          res = await apiGet("/depart");
          processDepartment(res.data.data || res.data || []);
          break;
        case "Program":
          res = await apiGet("/Program");
          processProgram(res.data.data || res.data || []);
          break;
        case "Course":
          res = await apiGet("/Course");
          processCourse(res.data.data || res.data || []);
          break;
        case "Semester":
          res = await apiGet("/Semester");
          processSemester(res.data.data || res.data || []);
          break;
        case "StaffAttendance":
          // fetch today's attendance by default
          res = await apiGet("/attendance");
          processAttendance(res.data.data || res.data || []);
          break;
        default:
          setRows([]);
          setColumns([]);
      }
    } catch (err) {
      console.error(err);
      showError(
        err.response?.data?.message || err.message || "Failed to fetch"
      );
      setRows([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  // User list special (GET /getuser) — only show 3 columns: _id, name/Username/email
  const openUserList = async () => {
    setLoading(true);
    try {
      const res = await apiGet("/getuser");
      const data = res.data.data || res.data || [];
      const processed = (data || []).map((u) => ({
        id: u._id,
        _id: u._id,
        Username: u.Username || u.name || u.Username,
        email: u.email,
      }));
      setColumns([
        { field: "_id", headerName: "_id", width: 260 },
        { field: "Username", headerName: "Name", width: 220 },
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

  // Processors (map API response -> DataGrid rows + columns)
  const processTeacher = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "staff_fullName", headerName: "Staff Name", width: 180 },
      { field: "experienceYear", headerName: "Experience", width: 120 },
      { field: "qulification", headerName: "Qualification", width: 160 },
      { field: "specialization", headerName: "Specialization", width: 200 },
      { field: "universityName", headerName: "University", width: 200 },
      { field: "passingYear", headerName: "Passing Year", width: 130 },
      actionColumn(),
    ];
    const rows = data.map((t) => ({
      id: t._id,
      _id: t._id,
      staffId: t.staffId?._id,
      staff_fullName: t.staffId?.fullName || t.staffId?.Username || "N/A",
      experienceYear: t.experienceYear,
      qulification: t.qulification,
      specialization: t.specialization,
      universityName: t.universityName,
      passingYear: t.passingYear,
      raw: t,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processStaff = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "userId", headerName: "User ID", width: 190 },
      { field: "fullName", headerName: "Full Name", width: 180 },
      { field: "designation", headerName: "Designation", width: 150 },
      { field: "department", headerName: "DepartmentId", width: 200 },
      { field: "email", headerName: "Email", width: 210 },
      actionColumn(),
    ];
    const rows = data.map((s) => ({
      id: s._id,
      _id: s._id,
      userId: s.userId,
      fullName: s.fullName,
      designation: s.designation,
      department: s.departmentId?.departmentName || "N/A",
      email: s.email,
      raw: s,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processDepartment = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "departmentName", headerName: "Department", width: 220 },
      { field: "officeLocation", headerName: "Office", width: 220 },
      { field: "phone", headerName: "Phone", width: 160 },
      actionColumn(),
    ];
    const rows = data.map((d) => ({
      id: d._id,
      _id: d._id,
      departmentName: d.departmentName,
      officeLocation: d.officeLocation,
      phone: d.phone,
      raw: d,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processProgram = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "programName", headerName: "Program", width: 240 },
      { field: "level", headerName: "Level", width: 150 },
      { field: "durationYears", headerName: "Duration (yrs)", width: 140 },
      { field: "department", headerName: "Department", width: 200 },
      actionColumn(),
    ];
    const rows = data.map((p) => ({
      id: p._id,
      _id: p._id,
      programName: p.programName,
      level: p.level,
      durationYears: p.durationYears,
      department: p.departmentId?.departmentName || "N/A",
      raw: p,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processCourse = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "courseCode", headerName: "Code", width: 120 },
      { field: "courseName", headerName: "Name", width: 260 },
      { field: "creditHour", headerName: "Credits", width: 110 },
      { field: "departmentId", headerName: "DepartmentId", width: 200 },
      actionColumn(),
    ];
    const rows = data.map((c) => ({
      id: c._id,
      _id: c._id,
      courseCode: c.courseCode,
      courseName: c.courseName,
      creditHour: c.creditHour,
      department: c.departmentId?.departmentName || "N/A",
      raw: c,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processSemester = (data) => {
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "semesterNumber", headerName: "Semester", width: 120 },
      { field: "startDate", headerName: "Start Date", width: 150 },
      { field: "endDate", headerName: "End Date", width: 150 },
      { field: "year", headerName: "Year", width: 110 },
      actionColumn(),
    ];
    const rows = data.map((s) => ({
      id: s._id,
      _id: s._id,
      semesterNumber: s.semesterNumber,
      startDate: s.startDate ? s.startDate.split("T")[0] : "",
      endDate: s.endDate ? s.endDate.split("T")[0] : "",
      year: s.year,
      raw: s,
    }));
    setColumns(cols);
    setRows(rows);
  };

  const processAttendance = (data) => {
    // Filter only today's date (user requested) — but keep option to search staffId
    const todayIso = attendanceDate;
    const filtered = (data || []).filter(
      (a) => (a.date || "").split("T")[0] === todayIso
    );
    const cols = [
      { field: "_id", headerName: "_id", width: 250 },
      { field: "staffName", headerName: "Staff", width: 200 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "designation", headerName: "Designation", width: 150 },
      { field: "status", headerName: "Status", width: 130 },
      { field: "date", headerName: "Date", width: 150 },
      actionColumnAttendance(),
    ];
    const rows = filtered.map((a) => ({
      id: a._id,
      _id: a._id,
      staffId: a.staffId?._id,
      staffName: a.staffId?.fullName || a.staffId?.Username || "N/A",
      email: a.staffId?.email,
      designation: a.staffId?.designation,
      status: a.status,
      date: a.date ? a.date.split("T")[0] : "",
      raw: a,
    }));
    setColumns(cols);
    setRows(rows);
  };

  // Actions column (edit/delete) for normal modules
  function actionColumn() {
    return {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => openEditModal(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      },
    };
  }

  // Actions column for attendance: Edit (change status)
  function actionColumnAttendance() {
    return {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => openEditModal(row)}
            >
              Edit
            </Button>
          </Stack>
        );
      },
    };
  }

  // ============================
  // CREATE / EDIT / DELETE handlers
  // ============================
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

  // Prepare initial form schema & data based on active module
  const makeInitialFormFor = (module, data) => {
    // data may be null for create
    const d = data || {};
    switch (module) {
      case "Teacher":
        return {
          staffId: d.staffId?._id || d.staffId || "",
          experienceYear: d.experienceYear || "",
          qulification: d.qulification || "",
          specialization: d.specialization || "",
          universityName: d.universityName || "",
          passingYear: d.passingYear || "",
        };
      case "Staff":
        return {
          userId: d.userId || "",
          fullName: d.fullName || "",
          gender: d.gender || "",
          email: d.email || "",
          phone: d.phone || "",
          hireDate: d.hireDate ? d.hireDate.split("T")[0] : "",
          designation: d.designation || "",
          departmentId: d.departmentId?._id || d.departmentId || "",
          salary: d.salary || "",
        };
      case "Department":
        return {
          departmentName: d.departmentName || "",
          departmentHeadId: d.departmentHeadId || "",
          officeLocation: d.officeLocation || "",
          phone: d.phone || "",
        };
      case "Program":
        return {
          programName: d.programName || "",
          level: d.level || "",
          durationYears: d.durationYears || "",
          departmentId: d.departmentId?._id || d.departmentId || "",
        };
      case "Course":
        return {
          courseCode: d.courseCode || "",
          courseName: d.courseName || "",
          creditHour: d.creditHour || "",
          departmentId: d.departmentId?._id || d.departmentId || "",
        };
      case "Semester":
        return {
          semesterNumber: d.semesterNumber || "",
          startDate: d.startDate ? d.startDate.split("T")[0] : "",
          endDate: d.endDate ? d.endDate.split("T")[0] : "",
          year: d.year || "",
        };
      case "StaffAttendance":
        // For attendance edit we only change status
        return {
          staffId: d.staffId?._id || d.staffId || "",
          status: d.status || "present",
          date: d.date ? d.date.split("T")[0] : attendanceDate,
        };
      case "User":
        return {
          Username: d.Username || d.name || "",
          email: d.email || "",
          password: "",
          role: d.role || "",
        };
      default:
        return {};
    }
  };

  // Create or update on submit
  const handleSubmit = async () => {
    try {
      // basic validation
      // perform API according to active + whether editing
      if (!active) return;
      if (editing) {
        // PATCH
        const id = editing._id || editing.id;
        await handlePatch(active, id, form);
        showSuccess("Updated successfully");
      } else {
        // POST
        await handlePost(active, form);
        showSuccess("Created successfully");
      }
      setOpenModal(false);
      setEditing(null);
      setForm({});
      // refresh data
      if (active === "User") openUserList();
      else fetchModuleData(active);
    } catch (err) {
      console.error("submit err", err);
      showError(
        err.response?.data?.message || err.message || "Operation failed"
      );
    }
  };

  // POST handlers
  const handlePost = async (module, payload) => {
    switch (module) {
      case "Teacher":
        return axios.post(`${config.baseURL}/teacher`, payload);
      case "Staff":
        return axios.post(`${config.baseURL}/staff`, payload);
      case "Department":
        return axios.post(`${config.baseURL}/depart`, payload);
      case "Program":
        return axios.post(`${config.baseURL}/Program`, payload);
      case "Course":
        return axios.post(`${config.baseURL}/Course`, payload);
      case "Semester":
        return axios.post(`${config.baseURL}/Semester`, payload);
      case "StaffAttendance":
        // mark attendance
        return axios.post(`${config.baseURL}/attendance`, payload);
      case "User":
        // signup
        return axios.post(`${config.baseURL}/signup`, {
          Username: payload.Username,
          email: payload.email,
          password: payload.password,
          role: payload.role,
        });
      default:
        throw new Error("Unknown module for POST");
    }
  };

  // PATCH handlers
  const handlePatch = async (module, id, payload) => {
    switch (module) {
      case "Teacher":
        return axios.patch(`${config.baseURL}/teacher/${id}`, payload);
      case "Staff":
        return axios.patch(`${config.baseURL}/staff/${id}`, payload);
      case "Department":
        return axios.patch(`${config.baseURL}/depart/${id}`, payload);
      case "Program":
        return axios.patch(`${config.baseURL}/Program/${id}`, payload);
      case "Course":
        return axios.patch(`${config.baseURL}/Course/${id}`, payload);
      case "Semester":
        return axios.patch(`${config.baseURL}/Semester/${id}`, payload);
      case "StaffAttendance":
        return axios.patch(`${config.baseURL}/attendance/${id}`, payload);
      default:
        throw new Error("Unknown module for PATCH");
    }
  };

  // DELETE handler (User has no delete)
  const handleDelete = async (row) => {
    const ok = await confirmDelete("Delete this row?");
    if (!ok) return;
    try {
      const id = row._id || row.id;
      switch (active) {
        case "Teacher":
          await axios.delete(`${config.baseURL}/teacher/${id}`);
          break;
        case "Staff":
          await axios.delete(`${config.baseURL}/staff/${id}`);
          break;
        case "Department":
          await axios.delete(`${config.baseURL}/depart/${id}`);
          break;
        case "Program":
          await axios.delete(`${config.baseURL}/Program/${id}`);
          break;
        case "Course":
          await axios.delete(`${config.baseURL}/Course/${id}`);
          break;
        case "Semester":
          await axios.delete(`${config.baseURL}/Semester/${id}`);
          break;
        case "StaffAttendance":
          // maybe allow delete if backend supports - if not backend returns error
          await axios.delete(`${config.baseURL}/attendance/${id}`);
          break;
        default:
          throw new Error("Delete not supported for this module");
      }
      showSuccess("Deleted successfully");
      fetchModuleData(active);
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  // Attendance helpers: search by staffId and mark present POST
  const handleAttendanceSearch = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/attendance");
      const all = res.data.data || res.data || [];
      // filter by selected date (attendanceDate) and optionally staffId
      const filtered = all.filter(
        (a) => (a.date || "").split("T")[0] === attendanceDate
      );
      const byStaff = attendanceSearchId
        ? filtered.filter((a) => a.staffId?._id === attendanceSearchId)
        : filtered;
      processAttendance(byStaff.length ? byStaff : filtered);
    } catch (err) {
      console.error(err);
      showError("Attendance fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPresent = async () => {
    // payload: { staffId, status: "present", date }
    if (!attendanceSearchId)
      return showError(
        "Select staff to mark present (enter staffId in search)"
      );
    try {
      console.log("attendanceSearchId:", attendanceSearchId);
      await axios.post(`${config.baseURL}/attendance`, {
        staffId: attendanceSearchId,
        status: "present",
        // date: attendanceDate,
      });
      
      showSuccess("Marked present");
      fetchModuleData("StaffAttendance");
    } catch (err) {
      console.error(err);
      showError("Failed to mark present", err.message);
    }
  };

  // Auto mark all attendance
  const handleAutoMark = async () => {
    try {
      await axios.post(`${config.baseURL}/staffattendance/auto-mark`);
      showSuccess("Auto-mark triggered");
      fetchModuleData("StaffAttendance");
    } catch (err) {
      console.error(err);
      showError("Auto mark failed");
    }
  };

  // render form inputs dynamically based on active module
  const renderFormFields = () => {
    switch (active) {
      case "Teacher":
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Staff</InputLabel>
              <Select
                value={form.staffId || ""}
                label="Staff"
                onChange={(e) =>
                  setForm((p) => ({ ...p, staffId: e.target.value }))
                }
              >
                <MenuItem value="">Select staff</MenuItem>
                {staffList.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.fullName || s.userId || s._id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Experience Year"
              value={form.experienceYear || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, experienceYear: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Qualification"
              value={form.qulification || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, qulification: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Specialization"
              value={form.specialization || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, specialization: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="University Name"
              value={form.universityName || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, universityName: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Passing Year"
              value={form.passingYear || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, passingYear: e.target.value }))
              }
              fullWidth
            />
          </>
        );
      case "Staff":
        return (
          <>
            <TextField
              label="User ID"
              value={form.userId || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, userId: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Full Name"
              value={form.fullName || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, fullName: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Gender"
              value={form.gender || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, gender: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              value={form.email || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone"
              value={form.phone || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Hire Date"
              type="date"
              value={form.hireDate || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, hireDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Designation"
              value={form.designation || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, designation: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="DepartmentId"
              value={form.departmentId || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, departmentId: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />

            {/* <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select value={form.departmentId || ""} label="DepartmentId" onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))}>
                <MenuItem value="">Select department</MenuItem>
                {departments.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.departmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <TextField
              label="Salary"
              value={form.salary || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, salary: e.target.value }))
              }
              fullWidth
            />
          </>
        );
      case "Department":
        return (
          <>
            <TextField
              label="Department Name"
              value={form.departmentName || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, departmentName: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Department Head ID"
              value={form.departmentHeadId || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, departmentHeadId: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Office Location"
              value={form.officeLocation || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, officeLocation: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone"
              value={form.phone || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              fullWidth
            />
          </>
        );
      case "Program":
        return (
          <>
            <TextField
              label="Program Name"
              value={form.programName || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, programName: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Level"
              value={form.level || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, level: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Duration Years"
              type="number"
              value={form.durationYears || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, durationYears: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={form.departmentId || ""}
                label="Department"
                onChange={(e) =>
                  setForm((p) => ({ ...p, departmentId: e.target.value }))
                }
              >
                <MenuItem value="">Select department</MenuItem>
                {departments.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.departmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case "Course":
        return (
          <>
            <TextField
              label="Course Code"
              value={form.courseCode || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, courseCode: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Course Name"
              value={form.courseName || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, courseName: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Credit Hour"
              type="number"
              value={form.creditHour || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, creditHour: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={form.departmentId || ""}
                label="Department"
                onChange={(e) =>
                  setForm((p) => ({ ...p, departmentId: e.target.value }))
                }
              >
                <MenuItem value="">Select department</MenuItem>
                {departments.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.departmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case "Semester":
        return (
          <>
            <TextField
              label="Semester Number"
              type="number"
              value={form.semesterNumber || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, semesterNumber: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Start Date"
              type="date"
              value={form.startDate || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, startDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="End Date"
              type="date"
              value={form.endDate || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, endDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Year"
              type="number"
              value={form.year || ""}
              onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
              fullWidth
            />
          </>
        );
      case "StaffAttendance":
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Staff</InputLabel>
              <Select
                value={form.staffId || ""}
                label="Staff"
                onChange={(e) =>
                  setForm((p) => ({ ...p, staffId: e.target.value }))
                }
              >
                <MenuItem value="">Select staff</MenuItem>
                {staffList.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status || "present"}
                label="Status"
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value }))
                }
              >
                {["present", "absent", "late", "excused"].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={form.date || attendanceDate}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </>
        );
      case "User":
        return (
          <>
            <TextField
              label="Username"
              value={form.Username || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, Username: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              value={form.email || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              value={form.password || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={form.role || ""}
                label="Role"
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value }))
                }
              >
                <MenuItem value="">Select role</MenuItem>
                {USER_ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      default:
        return <Typography>No form configured</Typography>;
    }
  };

  // UI
  return (
    <>
    <Navbar />
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box sx={{ width: 240, bgcolor: "#0d1b2a", color: "white", p: 2 }}>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          SeniorDataEntryOperator
        </Typography>
        <List>
          {SIDEBAR.map((s) => (
            <ListItemButton
              key={s}
              selected={active === s}
              onClick={() => handleSelect(s)}
            >
              <ListItemText primary={s} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main */}
      <Box sx={{ flex: 1, p: 3, bgcolor: "#071226", color: "white" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5">
            {active || "Select a module from sidebar"}
          </Typography>

          {/* top controls: Create, attendance buttons */}
          <Stack direction="row" spacing={1}>
            {active === "" ? null : active === "User" ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setForm(makeInitialFormFor("User", null));
                  setOpenModal(true);
                }}
              >
                Create User
              </Button>
            ) : active === "StaffAttendance" ? (
              <>
                <TextField
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  size="small"
                  sx={{ bgcolor: "white", borderRadius: 1 }}
                />
                <TextField
                  placeholder="staffId (optional)"
                  value={attendanceSearchId}
                  onChange={(e) => setAttendanceSearchId(e.target.value)}
                  size="small"
                  sx={{ bgcolor: "black", borderRadius: 1 }}
                />
                <Button variant="contained" onClick={handleAttendanceSearch}>
                  Search
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleMarkPresent}
                >
                  Mark Present
                </Button>
                <Button variant="outlined" onClick={handleAutoMark}>
                  All Attendance Mark
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreateModal}
              >
                Create
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : rows.length > 0 ? (
          <Box sx={{ height: "72vh", bgcolor: "white", borderRadius: 1 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </Box>
        ) : (
          <Typography sx={{ mt: 6, color: "gray" }}>
            No data to display — click a sidebar item to load data.
          </Typography>
        )}
      </Box>

      {/* Modal (Create/Edit) */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editing ? `Edit ${active}` : `Create ${active}`}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1 }}>{renderFormFields()}</Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
              setEditing(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}
