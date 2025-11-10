import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, unique: true },
  courseName: { type: String, required: true },
  creditHour: Number,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", }
});

const Course = mongoose.model("Course", courseSchema);

export default Course