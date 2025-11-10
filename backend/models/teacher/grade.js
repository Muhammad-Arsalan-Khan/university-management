import mongoose from "mongoose";

const studentGradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  gradeLetter: String,
  gpa: Number,
  remarks: String
});


const StudentGrade = mongoose.model("StudentGrade", studentGradeSchema);


export default StudentGrade