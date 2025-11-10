import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment"},
  attendanceDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["present", "absent", "late", "excused"],
    default: "absent"
  }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance