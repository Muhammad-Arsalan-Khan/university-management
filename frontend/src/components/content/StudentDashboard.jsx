// import Navbar from "../navbar"
// function StudentDashboard() {
//   return (
//     <>
//     <Navbar />
//      <h1>student dashboard</h1>
//     </>
//   )
// }

// export default StudentDashboard

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  User,
  CalendarCheck,
  FileText,
  Award,
  LogOut,
  Menu,
} from "lucide-react";
import axios from "axios";
import Navbar from "../navbar";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const drawerWidth = 280;

  const config = {
    baseURL: "http://localhost:5000/api",
  };

  const userId = localStorage.getItem("userId");
  const id = userId
  // ✅ Student Profile API — GET + body (userId)
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.baseURL}/StudentgetbyId/${id}`, {
        data: { userId }, // body send in GET
        headers: { "Content-Type": "application/json" },
      });
      const studentData = res.data.data;
      setStudent(studentData);
      localStorage.setItem("studentData", JSON.stringify(studentData));
    } catch (err) {
      console.error("❌ Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Attendance API
  const fetchAttendance = async (id) => {
    try {
      const res = await axios.get(`${config.baseURL}/studendAttendance/${id}`);
      setAttendance(res.data);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    }
  };

  // ✅ Assignment API
  const fetchAssignments = async (semesterId, programId) => {
    try {
      const res = await axios.get(
        `${config.baseURL}/assessment/${semesterId}/${programId}`
      );
      setAssignments(res.data);
    } catch (err) {
      console.error("Assignment fetch error:", err);
    }
  };

  // ✅ Result API
  const fetchResult = async (id) => {
    try {
      const res = await axios.get(`${config.baseURL}/studentGrade/${id}`);
      setResult(res.data);
    } catch (err) {
      console.error("Result fetch error:", err);
    }
  };

  // 🔹 Component Load → Get Profile
  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔹 Once profile loaded → Fetch other data
  useEffect(() => {
    if (student?._id) {
      fetchAttendance(student._id);
      fetchAssignments(student.departmentId, student.admissionYear);
      fetchResult(student._id);
    }
  }, [student]);

  // 🔹 Drawer toggle for mobile
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // 🔹 Sidebar menu
  const menuItems = [
    { id: "profile", label: "Profile", icon: <User size={22} /> },
    { id: "attendance", label: "Attendance", icon: <CalendarCheck size={22} /> },
    { id: "assignments", label: "Assignments", icon: <FileText size={22} /> },
    { id: "result", label: "Result", icon: <Award size={22} /> },
  ];

  // ✅ Drawer UI
  const drawer = (
    <Box>
      <Box sx={{ p: 3, textAlign: "center", borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Student Portal
        </Typography>
      </Box>
      <List sx={{ px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeTab === item.id ? "white" : "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // ✅ Tab content
  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} thickness={4} />
        </Box>
      );
    }

    if (activeTab === "profile") {
      return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {student?.fullName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {student?.fullName}
              </Typography>
              <Typography variant="body1" color="primary">
                {student?.departmentId}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {[
              { label: "Email", value: student?.email },
              { label: "Phone", value: student?.phone },
              { label: "Gender", value: student?.gender },
              { label: "Admission Year", value: student?.admissionYear },
              { label: "Status", value: student?.status },
              { label: "Address", value: student?.address },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      {item.label}
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      );
    }

    // attendance, assignments, result tabs same as before (no change needed)
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {menuItems.find((item) => item.id === activeTab)?.label}
            </Typography>
            <Button color="inherit" startIcon={<LogOut size={18} />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 2 }}>
            {renderContent()}
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default StudentDashboard;
