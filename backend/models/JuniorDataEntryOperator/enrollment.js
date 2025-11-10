import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", },
  enrollmentDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "completed", "dropped", "pending"],
    default: "active"
  }
});


const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment