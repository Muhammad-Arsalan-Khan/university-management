import express from "express"
const Router = express.Router()
import upload from "../middleware/multer/multer.js";
import { signup, login , getUser } from "../controller/auth/auth.js"
import {getStaff,createStaff,modifyStaff,deleteStaff,getDepart,createDepart,modifyDepart,deleteDepart,getTeacher,createTeacher,modifyTeacher,deleteTeacher,Attendance,modifyAttendance,getAllAttendance, autoMarkStaffAttendance } from "../controller/SeniorDataEntryOperator/controller.js"
import {
  // Course
  getCourse,
  createCourse,
  modifyCourse,
  deleteCourse,

  // Enrollment
  getEnrollment,
  createEnrollment,
  modifyEnrollment,
  deleteEnrollment,

  // Guardian
  getGuardian,
  createGuardian,
  modifyGuardian,
  deleteGuardian,

  // Program
  getProgram,
  createProgram,
  modifyProgram,
  deleteProgram,

  // Semester
  getSemester,
  createSemester,
  modifySemester,
  deleteSemester,

  // Student
  getStudent,
  createStudent,
  modifyStudent,
  deleteStudent,
  getstudentByUserId
} from "../controller/juniourDataEntryOprator/controller.js"

import {  markEntry, markExit, getAllLogs } from "../controller/lab/lab.js"

import {
  createBook,
  getAllBooks,
  getBookByName,
  updateBook,
  deleteBook
} from "../controller/librarian/librarian.js";

import {
  createBorrowRecord,
  getAllBorrowRecords,
  getBorrowRecordById,
  updateBorrowRecord,
  deleteBorrowRecord
} from "../controller/librarian/borrow.js";

import {
  getFeeStructures,
  createFeeStructure,
  modifyFeeStructure,
  deleteFeeStructure
} from "../controller/feeOprator/fee.js";

import {
  createStudentFee,
  getStudentFees,
  modifyStudentFee,
  deleteStudentFee,
  getStudentFeeByStudentId
} from "../controller/student/fee.js";

import {
  createAssessment,
  getAssessments,
  // getAssessmentById,
  // updateAssessment,
  deleteAssessment,
  getAssessmentBySemesterAndProgram,

  createAttendance,
  getAttendance,
  updateAttendance,
  autoMarkAttendance,
  getAttendanceById,
  // deleteAttendance

  createStudentGrade,
  getStudentGrades,
  updateStudentGrade,
  deleteStudentGrade,
  getStudentGradeById,

} from "../controller/teacher/teacher.js";


// //Auth
Router.post("/signup", signup)
Router.post("/login", login)
Router.get("/getuser", getUser)
//SeniorDataEntryOperator
//get
Router
  .route("/staff")
  .get(getStaff)
  .post(createStaff)
Router
  .route("/staff/:id")
  .patch(modifyStaff)
  .delete(deleteStaff)

//department
Router
  .route("/depart")
  .get(getDepart)
  .post(createDepart)
Router
  .route("/depart/:id")
  .patch(modifyDepart)
  .delete(deleteDepart)

//teacher
Router
  .route("/teacher")
  .get(getTeacher)
  .post(createTeacher)
Router
  .route("/teacher/:id")
  .patch(modifyTeacher)
  .delete(deleteTeacher)


Router
  .route("/attendance")
  .post(Attendance)
  .get(getAllAttendance)

Router.route("/staffattendance/auto-mark")
  .post(autoMarkStaffAttendance);

Router
  .route("/attendance/:id")
  .patch(modifyAttendance)

//--------------------------JDEO
Router
  .route("/Course")
  .get(getCourse)
  .post(createCourse)
Router
  .route("/Course/:id")
  .patch(modifyCourse)
  .delete(deleteCourse)

Router
  .route("/Enrollment")
  .get(getEnrollment)
  .post(createEnrollment)
Router
  .route("/Enrollment/:id")
  .patch(modifyEnrollment)
  .delete(deleteEnrollment)

Router
  .route("/Guardian")
  .get(getGuardian)
  .post(createGuardian)
Router
  .route("/Guardian/:id")
  .patch(modifyGuardian)
  .delete(deleteGuardian)

Router
  .route("/Program")
  .get(getProgram)
  .post(createProgram)
Router
  .route("/Program/:id")
  .patch(modifyProgram)
  .delete(deleteProgram)

Router
  .route("/Semester")
  .get(getSemester)
  .post(createSemester)
Router
  .route("/Semester/:id")
  .patch(modifySemester)
  .delete(deleteSemester)

Router
  .route("/Student")
  .get(getStudent)
  .post(createStudent)
Router
  .route("/StudentgetbyId/:id")
  .get(getstudentByUserId)
Router
  .route("/Student/:id")
  .patch(modifyStudent)
  .delete(deleteStudent)

//lab

Router.post("/labenter", markEntry); 
Router.post("/labexit", markExit);  
Router.get("/lab", getAllLogs);  


//librarian
Router.post("/createbook", createBook);      
Router.get("/getAllBooks", getAllBooks);     
Router.get("/getBookByName", getBookByName);   
Router.patch("/updateBook/:id", updateBook);    
Router.delete("deleteBook/:id", deleteBook); 

Router.post("/createBorrowRecord", createBorrowRecord);       
Router.get("/getAllBorrowRecords", getAllBorrowRecords);       
Router.get("/getBorrowRecordById/:id", getBorrowRecordById);   
Router.patch("/updateBorrowRecord/:id", updateBorrowRecord);     
Router.delete("/deleteBorrowRecord/:id", deleteBorrowRecord);  


//fee oprator
Router
  .route("/FeeStructure")
  .get(getFeeStructures)
  .post(createFeeStructure);

Router
  .route("/FeeStructure/:id")
  .patch(modifyFeeStructure)
  .delete(deleteFeeStructure);


// student fee
Router
  .route("/StudentFee")
  .get(getStudentFees)
  .post(createStudentFee);


Router
  .route("/StudentFee/:id")
  .get(getStudentFeeByStudentId)
  .patch(modifyStudentFee)
  .delete(deleteStudentFee);


//teacher assigment
Router.get("/assessment/:semesterId/:programId", getAssessmentBySemesterAndProgram);
Router.route("/Assessment")
  .get(getAssessments)
  .post(upload.single("file"), createAssessment)

Router.route("/Assessment/:id")
  .delete(deleteAssessment)
  // .get(getAssessmentById)
  // .patch(upload.single("file"), updateAssessment)

//teacher attendance
Router.route("/studendAttendance")
  .get(getAttendance)
  .post(createAttendance);

Router.route("/studendAttendance/auto-mark")
  .post(autoMarkAttendance);

Router.route("/studendAttendance/:id")
   .patch(updateAttendance)
   .get(getAttendanceById)
// .delete(deleteAttendance)
// 

//student grade
Router.route("/studentGrade")
  .get(getStudentGrades)
  .post(createStudentGrade);

Router.route("/studentGrade/:id")
  .patch(updateStudentGrade)
  .delete(deleteStudentGrade)
  .get(getStudentGradeById)



// Router
//   .route("/user")
//   .get(getData)
//   .post(createData)

// // Main analysis endpoint
// Router.post('/analyze-combined/:id',  upload.single('medicalReportFile'), getData);


export default Router