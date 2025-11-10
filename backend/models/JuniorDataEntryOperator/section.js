import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  sectionName: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course",  },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
});

const Section = mongoose.model("Section", sectionSchema);

export default Section