import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  semesterNumber: { type: Number, },
  startDate: Date,
  endDate: Date,
  year: Number
});

const Semester = mongoose.model("Semester", semesterSchema);

export default Semester