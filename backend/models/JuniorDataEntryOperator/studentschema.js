import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
  email: { type: String, required: true, unique: true },
  phone: String,
  dob: Date,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  admissionYear: Number,
  admissionDate: Date,
  status: { type: String, enum: ["pass_out", "undergraduate", "freeze", "drop_out"], default: "undergraduate" },
  address: String,
  batch: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);

export default Student