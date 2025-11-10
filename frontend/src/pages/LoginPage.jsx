// import { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Snackbar,
//   Alert,
//   Link,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import OtpModal from "../model/otp";
// import config from "../config.js";
// import Cookies from "js-cookie";

// const LoginPage = () => {
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "info",
//   });
//   const navigate = useNavigate();

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ });

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true)
//       const res = await axios.post(`${config.baseURL}/login`, data)
//       // console.log(res)
//       const userData = res.data.user
//       localStorage.setItem("user", JSON.stringify(userData))
//       // console.log(userData.isVerified)
//       if (userData.isVerified) {
//         setSnackbar({
//           open: true,
//           message: "Login successful",
//           severity: "success",
//         });
//         console.log(userData.role)
//         if (userData.isAdmin) {
//           setTimeout(() => {
//             Cookies.set("token", res.data.token);
//             Cookies.set("isVerified", res.data.Verified);
//             navigate(`/admin/dashboard/${userData._id}`);
//           }, 1500);
//         } else {
//           setTimeout(() => {
//             Cookies.set("token", res.data.token)
//             navigate(`/dashboard/${userData.id}`)
//           }, 1000);
//         }
//         setLoading(false);
//       }
//     } catch (err) {
//       setLoading(false)
//       if (err.response?.data?.message == "unAuthorized user") {
//         console.log(err)
//         const email = err.response?.data?.email
//         localStorage.setItem("user_email", email)
//         setUserId(err.response?.data?.data)
//         setSnackbar({
//           open: true,
//           message: "Please verify your account via OTP try to login again",
//           severity: "warning",
//         })
//         setShowOtpModal(true)
//       }
//       setSnackbar({
//         open: true,
//         message:
//           err.response?.data?.message || "Login failed. Check credentials.",
//         severity: "error",
//       });
//     }
//   };

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: { xs: 2, sm: 4 },
//         maxWidth: { xs: "90%", sm: 450 },
//         mx: "auto",
//         mt: { xs: 3, sm: 5 },
//       }}
//       >
//       <Typography variant="h5" color="#4CAF50" gutterBottom>
//         Login
//       </Typography>

//       <Box component="form" onSubmit={handleSubmit(onSubmit)}>
//         {[
//           { name: "email", label: "Email" },
//           { name: "password", label: "Password", type: "password" },
//         ].map((field) => (
//           <Box key={field.name} mb={2}>
//             <Controller
//               name={field.name}
//               control={control}
//               render={({ field: controllerField }) => (
//                 <TextField
//                   fullWidth
//                   label={field.label}
//                   type={field.type || "text"}
//                   {...controllerField}
//                   error={!!errors[field.name]}
//                   helperText={errors[field.name]?.message}
//                 />
//               )}
//             />
//           </Box>
//         ))}

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           sx={{ mt: 2,bgcolor: "#4CAF50", color: "white", "&:hover": { backgroundColor: "#4ccd51ff" }, }}
//           disabled={loading}
//         >
//           Login
//         </Button>
//         <Box sx={{ marginTop: 2 }}>
//           <Typography variant="body2" color="textSecondary" align="center">
//             Don't have an account?{" "}
//             <Link href="/signup" underline="hover" color="#4CAF50">
//               Signup
//             </Link>
//           </Typography>
//         </Box>
//       </Box>

//       {showOtpModal && (
//         <OtpModal
//           onClose={() => setShowOtpModal(false)}
//           userId={userId}
//           page={"login"}
//         />
//       )}

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Paper>
//   );
// };

// export default LoginPage

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import OtpModal from "../model/otp";
import config from "../config.js";
import Cookies from "js-cookie";

const LoginPage = () => {
  // const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [userId, setUserId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(`${config.baseURL}/login`, data);
      // const userData = res.data.user;
      console.log(res.data)
      localStorage.setItem("userId", JSON.stringify(res.data.id));
      if (res.data.token) {
        setSnackbar({
          open: true,
          message: "Login successful",
          severity: "success",
        });
        setTimeout(() => {
          Cookies.set("token", res.data.token);
          if (res.data.HOD) {
            Cookies.set("HOD", res.data.HOD);
            navigate(`/admin/dashboard/${res.data.id}`);
          }
          else if(res.data.SeniorDataEntryOperator){
            Cookies.set("SeniorDataEntryOperator", res.data.SeniorDataEntryOperator);
            navigate(`/SeniorDataEntryOperator/dashboard/${res.data.id}`);
          }
          else if(res.data.other){
            Cookies.set("other", res.data.other);
            navigate(`/staff/dashboard/${res.data.id}`);
          }
          else if(res.data.JuniorDataEntryOperator){
            Cookies.set("JuniorDataEntryOperator", res.data.JuniorDataEntryOperator);
            navigate(`/JuniorDataEntryOperator/dashboard/${res.data.id}`);
          }
          else if(res.data.Librarian){
            Cookies.set("Librarian", res.data.Librarian);
            navigate(`/Librarian/dashboard/${res.data.id}`);
          }
          else if(res.data.LabIncharge){
            Cookies.set("LabIncharge", res.data.LabIncharge);
            navigate(`/LabIncharge/dashboard/${res.data.id}`);
          }
          else if(res.data.Teacher){
            Cookies.set("Teacher", res.data.Teacher);
            navigate(`/Teacher/dashboard/${res.data.id}`);
          }
          else if(res.data.Student){
            Cookies.set("Student", res.data.Student);
            navigate(`/Student/dashboard/${res.data.id}`);
          }
           else {
            navigate(`/dashboard/${res.data.id}`);
          }
        }, 3000);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message === "unAuthorized user") {
        const email = err.response?.data?.email;
        localStorage.setItem("user_email", email);
        // setUserId(err.response?.data?.data);
        setSnackbar({
          open: true,
          message: "Please verify your account via OTP and try again.",
          severity: "warning",
        });
        // setShowOtpModal(true);
      } else {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Login failed. Try again.",
          severity: "error",
        });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 420,
          width: "90%",
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{ color: "#4CAF50" }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mb={3}
        >
          Please login to your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <Box mb={2}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Box>

          {/* Password */}
          <Box mb={3}>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: "#4CAF50",
              color: "#fff",
              fontWeight: "600",
              fontSize: "1rem",
              py: 1.2,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#43a047" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          {/* <Typography
            variant="body2"
            textAlign="center"
            mt={3}
            color="textSecondary"
          >
            Don’t have an account?{" "}
            <Link href="/signup" underline="hover" color="#4CAF50">
              Sign up
            </Link>
          </Typography> */}
        </Box>

        {/* {showOtpModal && (
          <OtpModal
            onClose={() => setShowOtpModal(false)}
            userId={userId}
            page="login"
          />
        )} */}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default LoginPage;
