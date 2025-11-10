import Course from "../../models/JuniorDataEntryOperator/courses.js"
import Enrollment from "../../models/JuniorDataEntryOperator/enrollment.js"
import Guardian from "../../models/JuniorDataEntryOperator/guardian.js"
import Program from "../../models/JuniorDataEntryOperator/program.js"
// import Section from "../../models/JuniorDataEntryOperator/section"
import Semester from "../../models/JuniorDataEntryOperator/semester.js"
import Student from "../../models/JuniorDataEntryOperator/studentschema.js"

// -------------------- Course --------------------
const getCourse = async (req, res) => {
  try {
    const courses = await Course.find().populate("departmentId");
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

 const modifyCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course nahi mila" });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

 const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course nahi mila" });
    res.status(200).json({ success: true, message: "Course delete ho gaya" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Enrollment --------------------
 const getEnrollment = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate("studentId");
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEnrollment = async (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

 const modifyEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment nahi mila" });
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

 const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment nahi mila" });
    res.status(200).json({ success: true, message: "Enrollment delete ho gaya" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Guardian --------------------
const getGuardian = async (req, res) => {
  try {
    const guardians = await Guardian.find().populate("studentId");
    res.status(200).json({ success: true, data: guardians });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createGuardian = async (req, res) => {
  try {
    const guardian = new Guardian(req.body);
    await guardian.save();
    res.status(201).json({ success: true, data: guardian });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const modifyGuardian = async (req, res) => {
  try {
    const guardian = await Guardian.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!guardian) return res.status(404).json({ success: false, message: "Guardian nahi mila" });
    res.status(200).json({ success: true, data: guardian });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteGuardian = async (req, res) => {
  try {
    const guardian = await Guardian.findByIdAndDelete(req.params.id);
    if (!guardian) return res.status(404).json({ success: false, message: "Guardian nahi mila" });
    res.status(200).json({ success: true, message: "Guardian delete ho gaya" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Program --------------------
const getProgram = async (req, res) => {
  try {
    const programs = await Program.find().populate("departmentId");
    res.status(200).json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.status(201).json({ success: true, data: program });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const modifyProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ success: false, message: "Program nahi mila" });
    res.status(200).json({ success: true, data: program });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: "Program nahi mila" });
    res.status(200).json({ success: true, message: "Program delete ho gaya" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Semester --------------------
const getSemester = async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.status(200).json({ success: true, data: semesters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSemester = async (req, res) => {
  try {
    const semester = new Semester(req.body);
    await semester.save();
    res.status(201).json({ success: true, data: semester });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const modifySemester = async (req, res) => {
  try {
    const semester = await Semester.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!semester) return res.status(404).json({ success: false, message: "Semester nahi mila" });
    res.status(200).json({ success: true, data: semester });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findByIdAndDelete(req.params.id);
    if (!semester) return res.status(404).json({ success: false, message: "Semester nahi mila" });
    res.status(200).json({ success: true, message: "Semester delete ho gaya" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Student --------------------
const getStudent = async (req, res) => {
  try {
    const students = await Student.find().populate("userId departmentId");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getstudentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const students = await Student.find({ userId })
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const modifyStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: "Student nahi mila" });
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student nahi mila" });
    res.status(200).json({ success: true, message: "Student delete ho gaya" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export {
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
};
