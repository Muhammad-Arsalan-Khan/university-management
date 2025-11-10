// import Navbar from "../navbar"
// function LabIncharge() {
//   return (
//     <>
//     <Navbar />
//      <h1>LabInchargeContent</h1>
//     </>
//   )
// }

// export default LabIncharge

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import Navbar from "../navbar";
import axios from "axios";

function LabInchargeDashboard() {
  const [userIdInput, setUserIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const config = {
    baseURL: "http://localhost:5000/api",
  };

  // POST → /labenter
  const handleEnter = async () => {
    if (!userIdInput.trim()) return alert("Please enter a valid User ID");
    try {
      setLoading(true);
      const res = await axios.post(`${config.baseURL}/labenter`, { userId: userIdInput });
      alert("✅ Entry recorded successfully!");
      console.log(res.data);
      setUserIdInput("");
    } catch (err) {
      console.error("Enter error:", err);
      alert("Error while entering lab!");
    } finally {
      setLoading(false);
    }
  };

  // POST → /labexit
  const handleExit = async () => {
    if (!userIdInput.trim()) return alert("Please enter a valid User ID");
    try {
      setLoading(true);
      const res = await axios.post(`${config.baseURL}/labexit`, { userId: userIdInput });
      alert("👋 Exit recorded successfully!");
      console.log(res.data);
      setUserIdInput("");
    } catch (err) {
      console.error("Exit error:", err);
      alert("Error while exiting lab!");
    } finally {
      setLoading(false);
    }
  };

  // GET → /lab (History)
  const handleHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.baseURL}/lab`);

      // ✅ ensure always an array (to fix .map error)
      const records = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setHistory(records);
    } catch (err) {
      console.error("History error:", err);
      alert("Error loading lab history!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f4ff 0%, #e3f2fd 100%)",
          py: 6,
        }}
      >
        <Box
          sx={{
            maxWidth: 800,
            mx: "auto",
            p: 4,
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1565c0", mb: 3, textAlign: "center" }}
          >
            Lab In-Charge Dashboard
          </Typography>

          <TextField
            fullWidth
            label="Enter User ID"
            variant="outlined"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            sx={{ mb: 3, color:"black" }}
          />

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleEnter}
              disabled={loading}
              sx={{
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Enter"}
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleExit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Exit"}
            </Button>

            <Button
              variant="outlined"
              onClick={handleHistory}
              sx={{
                color: "#1565c0",
                borderColor: "#1565c0",
                "&:hover": { borderColor: "#0d47a1", color: "#0d47a1" },
              }}
            >
              History
            </Button>
          </Box>
        </Box>

        {/* History Table */}
        {history.length > 0 ? (
          <Box sx={{ maxWidth: 1000, mx: "auto", mt: 6 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "#0d47a1",
                textAlign: "center",
              }}
            >
              Lab Entry History
            </Typography>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1565c0" }}>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      User ID
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Entry Time
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Leave Time
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.userId?._id || "N/A"}</TableCell>
                      <TableCell>{item.userId?.role || "N/A"}</TableCell>
                      <TableCell>
                        {item.entryTime
                          ? new Date(item.entryTime).toLocaleTimeString()
                          : "--"}
                      </TableCell>
                      <TableCell>
                        {item.leaveTime
                          ? new Date(item.leaveTime).toLocaleTimeString()
                          : "--"}
                      </TableCell>
                      <TableCell>{item.date || "--"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography
            sx={{
              mt: 6,
              textAlign: "center",
              color: "gray",
              fontWeight: 500,
              fontSize: "18px",
            }}
          >
            📭 No record found. Click "History" to load data.
          </Typography>
        )}
      </Box>
    </>
  );
}

export default LabInchargeDashboard;
