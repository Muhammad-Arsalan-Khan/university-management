// import Navbar from "../navbar"
// function Librarian() {
//   return (
//     <>
//     <Navbar />
//      <h1>Librarian dashboard</h1>
//     </>
//   )
// }

// export default Librarian
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import axios from "axios";
import Navbar from "../navbar";
import config from "../../config";

function LibrarianDashboard() {
  const [activeSection, setActiveSection] = useState("search");
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedBook, setSearchedBook] = useState(null);

  const [addBookOpen, setAddBookOpen] = useState(false);
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    copiesAvailable: "",
  });

  const [borrowData, setBorrowData] = useState({
    bookId: "",
    studentId: "",
  });

  const [updateRecord, setUpdateRecord] = useState({
    id: "",
    returnDate: "",
  });

  const sections = [
    { id: "search", label: "Search Book" },
    { id: "allbooks", label: "Get All Books" },
    { id: "addbook", label: "Add Book" },
    { id: "borrow", label: "Borrow Book" },
    { id: "records", label: "Borrow Records" },
  ];

  useEffect(() => {
    if (activeSection === "allbooks") getAllBooks();
    if (activeSection === "records") getAllBorrowRecords();
  }, [activeSection]);

  // API Calls
  const handleSearch = async () => {
    try {
      const res = await axios.post(`${config.baseURL}/getBookByName`, {
        title: searchQuery,
      });
      setSearchedBook(res.data);
    } catch (err) {
      console.error(err);
      alert("Book not found!");
    }
  };

  const getAllBooks = async () => {
    try {
      const res = await axios.get(`${config.baseURL}/getAllBooks`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading books!");
    }
  };

  const handleAddBook = async () => {
    try {
      await axios.post(`${config.baseURL}/createbook`, formData);
      alert("Book added successfully!");
      setAddBookOpen(false);
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "",
        copiesAvailable: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding book!");
    }
  };

  const handleBorrowBook = async () => {
    try {
      await axios.post(`${config.baseURL}/createBorrowRecord`, borrowData);
      alert("Borrow record created!");
      setBorrowOpen(false);
      setBorrowData({ bookId: "", studentId: "" });
    } catch (err) {
      console.error(err);
      alert("Error creating borrow record!");
    }
  };

  const getAllBorrowRecords = async () => {
    try {
      const res = await axios.get(`${config.baseURL}/getAllBorrowRecords`);
      setBorrowRecords(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching borrow records!");
    }
  };

  const handleUpdateRecord = async () => {
    try {
      await axios.patch(
        `${config.baseURL}/updateBorrowRecord/${updateRecord.id}`,
        { returnDate: updateRecord.returnDate }
      );
      alert("Record updated successfully!");
      setUpdateOpen(false);
      getAllBorrowRecords();
    } catch (err) {
      console.error(err);
      alert("Error updating record!");
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", background: "#f9fafc" }}>
        {/* Sidebar */}
        <Drawer variant="permanent" sx={{ width: 240 }}>
          <List sx={{ mt: 8 }}>
            {sections.map((sec) => (
              <ListItem key={sec.id} disablePadding>
                <ListItemButton
                  onClick={() => setActiveSection(sec.id)}
                  sx={{
                    backgroundColor:
                      activeSection === sec.id ? "#1565c0" : "transparent",
                    color: activeSection === sec.id ? "white" : "black",
                    mb: 1,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#1976d2", color: "white" },
                  }}
                >
                  <ListItemText primary={sec.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 6 }}>
          {/* Search Section */}
          {activeSection === "search" && (
            <Box>
              <Typography variant="h4" mb={3}>
                🔍 Search Book
              </Typography>
              <TextField
                label="Enter Book Title"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2, backgroundColor: "#fff" }}
              />
              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>

              {searchedBook && (
                <Paper sx={{ p: 3, mt: 4, backgroundColor: "#fff" }}>
                  <Typography variant="h6" color="primary">
                    {searchedBook.title}
                  </Typography>
                  <Typography>Author: {searchedBook.author}</Typography>
                  <Typography>ISBN: {searchedBook.isbn}</Typography>
                  <Typography>Category: {searchedBook.category}</Typography>
                  <Typography>
                    Copies Available: {searchedBook.copiesAvailable}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* All Books Section */}
          {activeSection === "allbooks" && (
            <Box>
              <Typography variant="h4" mb={3}>
                📚 All Books
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#1565c0" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Title</TableCell>
                      <TableCell sx={{ color: "white" }}>Author</TableCell>
                      <TableCell sx={{ color: "white" }}>ISBN</TableCell>
                      <TableCell sx={{ color: "white" }}>Category</TableCell>
                      <TableCell sx={{ color: "white" }}>Copies</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books.map((b) => (
                      <TableRow key={b._id}>
                        <TableCell>{b.title}</TableCell>
                        <TableCell>{b.author}</TableCell>
                        <TableCell>{b.isbn}</TableCell>
                        <TableCell>{b.category}</TableCell>
                        <TableCell>{b.copiesAvailable}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Borrow Records Section */}
          {activeSection === "records" && (
            <Box>
              <Typography variant="h4" mb={3}>
                📜 Borrow Records
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#1565c0" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Book Title</TableCell>
                      <TableCell sx={{ color: "white" }}>Student Email</TableCell>
                      <TableCell sx={{ color: "white" }}>Issue Date</TableCell>
                      <TableCell sx={{ color: "white" }}>Return Date</TableCell>
                      <TableCell sx={{ color: "white" }}>Fine</TableCell>
                      <TableCell sx={{ color: "white" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {borrowRecords.map((r) => (
                      <TableRow key={r._id}>
                        <TableCell>{r.bookId?.title}</TableCell>
                        <TableCell>{r.studentId?.email}</TableCell>
                        <TableCell>
                          {new Date(r.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {r.returnDate
                            ? new Date(r.returnDate).toLocaleDateString()
                            : "--"}
                        </TableCell>
                        <TableCell>{r.fineAmount}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setUpdateRecord({ id: r._id, returnDate: "" });
                              setUpdateOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Book Dialog */}
      <Dialog open={addBookOpen} onClose={() => setAddBookOpen(false)}>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#fff" }}>
          {["title", "author", "isbn", "category", "copiesAvailable"].map(
            (field) => (
              <TextField
                key={field}
                fullWidth
                margin="dense"
                label={field}
                name={field}
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
              />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddBookOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBook}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Borrow Book Dialog */}
      <Dialog open={borrowOpen} onClose={() => setBorrowOpen(false)}>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#fff" }}>
          <TextField
            fullWidth
            margin="dense"
            label="Book ID"
            value={borrowData.bookId}
            onChange={(e) =>
              setBorrowData({ ...borrowData, bookId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Student ID"
            value={borrowData.studentId}
            onChange={(e) =>
              setBorrowData({ ...borrowData, studentId: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBorrowOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBorrowBook}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Borrow Record Dialog */}
      <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <DialogTitle>Update Return Date</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#fff" }}>
          <TextField
            fullWidth
            margin="dense"
            type="date"
            label="Return Date"
            value={updateRecord.returnDate}
            onChange={(e) =>
              setUpdateRecord({ ...updateRecord, returnDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateRecord}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LibrarianDashboard;
