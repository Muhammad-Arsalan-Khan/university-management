// import {
//   AppBar,
//   Toolbar,
//   Button,
//   Typography,
//   Box,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";
// import SchoolIcon from "@mui/icons-material/School";
// import Cookies from "js-cookie";
// import { useEffect, useState } from "react";

// const Navbar = () => {
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [authCheck, setAuthCheck] = useState(false);
//   // const [admin, setAdmin] = useState(false);
//   const [userData, setUserData] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = Cookies.get("token");
//     const HOD = Cookies.get("HOD");

//     if (token) {
//       setAuthCheck(true);
//       // setAdmin(isVerified === "true");
//       // setUserData(JSON.parse(user));
//     } else {
//       setAuthCheck(false);
//       // setAdmin(false);
//       setUserData(null);
//     }
//   }, []);

//   const toggleDrawer = () => {
//     setOpenDrawer(!openDrawer);
//   };

//   const logout = () => {
//     Cookies.remove("token");
//     Cookies.remove("HOD");
//     // localStorage.removeItem("user");
//     setAuthCheck(false);
//     // setAdmin(false);
//     setUserData(null);
//     navigate("/");
//   };

//   const menuItems = (
//     <>
//       {authCheck ? (
//         <>
//           <ListItem button component={Link} to="/" sx={{ color: "#333" }}>
//             <ListItemText primary="Home" />
//           </ListItem>
//           <ListItem
//             button
//             component={Link}
//             to={
//               admin
//                 ? `/admin/dashboard/${userData?.id}`
//                 : `/dashboard/${userData?.id}`
//             }
//             sx={{ color: "#333" }}
//           >
//             <ListItemText primary="Dashboard" />
//           </ListItem>
//           <ListItem
//             button
//             onClick={logout}
//             sx={{
//               backgroundColor: "#1976d2",
//               color: "#fff",
//               "&:hover": { backgroundColor: "#1565c0" },
//             }}
//           >
//             <ListItemText primary="Logout" />
//           </ListItem>
//         </>
//       ) : (
//         <>
//           <ListItem
//             button
//             component={Link}
//             to="/signup"
//             sx={{
//               backgroundColor: "#1976d2",
//               color: "#fff",
//               mb: 1,
//               "&:hover": { backgroundColor: "#1565c0" },
//             }}
//           >
//             <ListItemText primary="Signup" />
//           </ListItem>
//           <ListItem
//             button
//             component={Link}
//             to="/login"
//             sx={{
//               backgroundColor: "#1976d2",
//               color: "#fff",
//               "&:hover": { backgroundColor: "#1565c0" },
//             }}
//           >
//             <ListItemText primary="Login" />
//           </ListItem>
//         </>
//       )}
//     </>
//   );

//   return (
//     <>
//       {/* ✅ Top Logout Button (when logged in) */}
//       {authCheck && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             padding: "10px 16px",
//           }}
//         >
//           <Button
//             color="inherit"
//             onClick={logout}
//             sx={{
//               backgroundColor: "#1976d2",
//               color: "#fff",
//               fontSize: "0.8rem",
//               padding: "5px 12px",
//               borderRadius: "6px",
//               "&:hover": { backgroundColor: "#1565c0" },
//             }}
//           >
//             Logout
//           </Button>
//         </Box>
//       )}

//       {/* ✅ Main AppBar */}
//       {!authCheck && (
//         <AppBar
//           position="sticky"
//           sx={{
//             background: "linear-gradient(90deg, #1976d2, #1565c0)",
//             boxShadow: 3,
//           }}
//         >
//           <Toolbar
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             {/* Left: Logo and Title */}
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <SchoolIcon sx={{ mr: 1, color: "white" }} />
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: 700,
//                   color: "white",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 UniManage Pro
//               </Typography>
//             </Box>

//             {/* Mobile Menu */}
//             <Box sx={{ display: { xs: "block", sm: "none" } }}>
//               <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
//                 <MenuIcon />
//               </IconButton>
//             </Box>

//             {/* Right Buttons (Desktop) */}
//             <Box sx={{ display: { xs: "none", sm: "block" } }}>
//               {/* <Button
//                 variant="outlined"
//                 color="inherit"
//                 component={Link}
//                 to="/signup"
//                 sx={{
//                   borderColor: "white",
//                   color: "white",
//                   fontWeight: "bold",
//                   mr: 1,
//                   "&:hover": {
//                     backgroundColor: "rgba(255,255,255,0.1)",
//                   },
//                 }}
//               >
//                 Signup
//               </Button> */}
//               <Button
//                 variant="contained"
//                 sx={{
//                   backgroundColor: "white",
//                   color: "#1976d2",
//                   fontWeight: "bold",
//                   "&:hover": { backgroundColor: "#e3f2fd" },
//                 }}
//                 component={Link}
//                 to="/login"
//               >
//                 Login
//               </Button>
//             </Box>
//           </Toolbar>
//         </AppBar>
//       )}

//       {/* ✅ Drawer (Mobile) */}
//       <Drawer
//         anchor="right"
//         open={openDrawer}
//         onClose={toggleDrawer}
//         sx={{
//           "& .MuiDrawer-paper": {
//             width: "65%",
//           },
//         }}
//       >
//         <Box
//           sx={{ width: "100%" }}
//           role="presentation"
//           onClick={toggleDrawer}
//           onKeyDown={toggleDrawer}
//         >
//           <List>{menuItems}</List>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  // ✅ Check token on mount
  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuth(!!token);
  }, []);

  // ✅ Logout function (remove all cookies)
  const handleLogout = () => {
    // sab cookies remove karo
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg, #1976d2, #1565c0)",
        boxShadow: 3,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
          UniManage Pro
        </Typography>

        {isAuth ? (
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: "white",
              color: "#1976d2",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            component={Link}
            to="/login"
            sx={{
              backgroundColor: "white",
              color: "#1976d2",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
