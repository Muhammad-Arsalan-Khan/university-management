import mongoose from "mongoose";

const staffAttendanceSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["present", "absent", "late", "excused"],
    default: "absent"
  }
});

const StaffAttendance = mongoose.model("StaffAttendance", staffAttendanceSchema);

export default StaffAttendance
