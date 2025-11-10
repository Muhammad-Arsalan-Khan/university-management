import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const menuItems = [
  "Staff",
  "Teacher",
  "Student",
  "Courses",
  "Semester",
  "Department",
  "Program",
  "User",
];

const roles = [
  "HOD",
  "SeniorDataEntryOperator",
  "JuniorDataEntryOperator",
  "feeOprator",
  "Librarian",
  "LabIncharge",
  "Teacher",
  "Student",
  "other",
];

const config = {
  baseURL: "http://localhost:5000/api", // replace with your API base URL
};

function AdminContent() {
  const [selected, setSelected] = useState("");
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  // User modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!selected) return;
    if (selected === "User") {
      setUserModalOpen(true);
    } else {
      fetchData(selected);
    }
  }, [selected]);

  // --------------------- API Fetch ---------------------
  const fetchData = async (item) => {
    setLoading(true);
    setTableData([]);
    try {
      let res;
      switch (item) {
        case "Staff":
          res = await axios.get(`${config.baseURL}/staff`);
          processStaff(res.data.data);
          break;
        case "Teacher":
          res = await axios.get(`${config.baseURL}/teacher`);
          processTeacher(res.data.data);
          break;
        case "Student":
          res = await axios.get(`${config.baseURL}/student`);
          processStudent(res.data.data);
          break;
        case "Courses":
          res = await axios.get(`${config.baseURL}/course`);
          processCourse(res.data.data);
          break;
        case "Semester":
          res = await axios.get(`${config.baseURL}/semester`);
          processSemester(res.data.data);
          break;
        case "Department":
          res = await axios.get(`${config.baseURL}/depart`);
          processDepartment(res.data.data);
          break;
        case "Program":
          res = await axios.get(`${config.baseURL}/program`);
          processProgram(res.data.data);
          break;
        default:
          setTableData([]);
          setColumns([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------- Process Data ---------------------
  const processStaff = (data) => {
    const cols = [
      { field: "_id", headerName: "ID", width: 250 },
      { field: "fullName", headerName: "Full Name", width: 200 },
      { field: "gender", headerName: "Gender", width: 100 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone", headerName: "Phone", width: 150 },
      { field: "designation", headerName: "Designation", width: 180 },
      { field: "salary", headerName: "Salary", width: 120 },
    ];
    const rows = data.map((item) => ({
      id: item._id,
      _id: item._id,
      fullName: item.fullName,
      gender: item.gender,
      email: item.email,
      phone: item.phone,
      designation: item.designation,
      salary: item.salary,
    }));
    setColumns(cols);
    setTableData(rows);
  };

  const processTeacher = (data) => {
    const cols = [
      { field: "_id", headerName: "ID", width: 250 },
      { field: "fullName", headerName: "Full Name", width: 200 },
      { field: "department", headerName: "Department", width: 180 },
      { field: "experienceYear", headerName: "Experience", width: 130 },
      { field: "qualification", headerName: "Qualification", width: 150 },
      { field: "specialization", headerName: "Specialization", width: 200 },
    ];
    const rows = data.map((item) => ({
      id: item._id,
      _id: item._id,
      fullName: item.staffId?.fullName || "",
      department: item.staffId?.departmentId?.departmentName || "",
      experienceYear: item.experienceYear,
      qualification: item.qulification,
      specialization: item.specialization,
    }));
    setColumns(cols);
    setTableData(rows);
  };

  const processStudent = (data) => {
    const cols = [
      { field: "_id", headerName: "ID", width: 250 },
      { field: "fullName", headerName: "Full Name", width: 200 },
      { field: "gender", headerName: "Gender", width: 100 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone", headerName: "Phone", width: 150 },
      { field: "admissionYear", headerName: "Admission Year", width: 150 },
      { field: "status", headerName: "Status", width: 150 },
    ];
    const rows = data.map((item) => ({
      id: item._id,
      _id: item._id,
      fullName: item.fullName,
      gender: item.gender,
      email: item.email,
      phone: item.phone,
      admissionYear: item.admissionYear,
      status: item.status,
    }));
    setColumns(cols);
    setTableData(rows);
  };

  const processCourse = (data) => {
    const cols = [
      { field: "_id", headerName: "ID", width: 250 },
      { field: "courseCode", headerName: "Code", width: 100 },
      { field: "courseName", headerName: "Name", width: 200 },
      { field: "creditHour", headerName: "Credit Hour", width: 130 },
      { field: "department", headerName: "Department", width: 180 },
    ];
    const rows = data.map((item) => ({
      id: item._id,
      _id: item._id,
      courseCode: item.courseCode,
      courseName: item.courseName,
      creditHour: item.creditHour,
      department: item.departmentId?.departmentName || "",
    }));
    setColumns(cols);
    setTableData(rows);
  };

  const processSemester = (data) => {
    const cols = [
      { field: "_id", headerName: "ID", width: 250 },
      { field: "semesterNumber", headerName: "Semester", width: 130 },
      { field: "year", headerName: "Year", width: 100 },
      { field: "startDate", headerName: "Start Date", width: 150 },
      { field: "endDate", headerName: "End Date", width: 150 },
    ];
    const rows = data.map((item) => ({
      id: item._id,
      _id: item._id,
      semesterNumber: item.semesterNumber,
      year: item.year,
      startDate: item.startDate?.split("T")[0],
      endDate: item.endDate?.split("T")[0],
    }));
    setColumns(cols);
    setTableData(rows);
  };

  const processDepartment = (data) => {
    const cols = [
      { field: "_id", headerName: "ID", width: 250 },
      { field: "departmentName", headerName: "Department", width: 200 },
      { field: "officeLocation", headerName: "Office", width: 180 },
      { field: "phone", headerName: "Phone", width: 150 },
    ];
    const rows = data.map((item) => ({
      id: item._id,
      _id: item._id,
      departmentName: item.departmentName,
      officeLocation: item.officeLocation,
      phone: item.phone,
    }));
    setColumns(cols);
    setTableData(rows);
  };

  const processProgram = (data) => {
    const cols = [
      { field: "_id", headerName: "ID", width: 250 },
      { field: "programName", headerName: "Program", width: 200 },
      { field: "level", headerName: "Level", width: 150 },
      { field: "durationYears", headerName: "Duration", width: 120 },
      { field: "department", headerName: "Department", width: 180 },
    ];
    const rows = data.map((item) => ({
      id: item._id,
      _id: item._id,
      programName: item.programName,
      level: item.level,
      durationYears: item.durationYears,
      department: item.departmentId?.departmentName || "",
    }));
    setColumns(cols);
    setTableData(rows);
  };

  // --------------------- Create User ---------------------
  const handleCreateUser = async () => {
    if (!username || !email || !password || !role) {
      alert("Please fill all fields");
      return;
    }
    try {
      const payload = {
        Username: username,
        email,
        password,
        role,
        userId: "auto-generated-or-empty",
        isAdmin: false,
      };

      const res = await axios.post(`${config.baseURL}/signup`, payload);
      console.log(res.data.data);
      Swal.fire({
        title: "User Created!",
        text: res.data.data,
        icon: "success",
      });
      alert("User created successfully!");
      setUserModalOpen(false);
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
    } catch (err) {
      console.error(err);
      alert("Failed to create user: " + err.message);
    }
  };

  // --------------------- JSX ---------------------
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 220,
          backgroundColor: "#0d1b2a",
          display: "flex",
          flexDirection: "column",
          padding: 2,
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item}
              selected={selected === item}
              onClick={() => setSelected(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, backgroundColor: "#0a1525", padding: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          {selected || "Select an item"} Content
        </Typography>

        {loading ? (
          <CircularProgress color="primary" />
        ) : tableData.length > 0 ? (
          <Box sx={{ height: "75vh", width: "100%" }}>
            <DataGrid
              rows={tableData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </Box>
        ) : (
          <Typography color="white">No data to display</Typography>
        )}
      </Box>

      {/* User Modal */}
      <Dialog open={userModalOpen} onClose={() => setUserModalOpen(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateUser}>Create</Button>
          <Button onClick={() => setUserModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminContent;
