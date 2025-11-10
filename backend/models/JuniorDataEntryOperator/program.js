import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
  programName: { type: String, required: true, unique: true },
  level: String,
  durationYears: Number,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department",}
});

const Program = mongoose.model("Program", programSchema);

export default Program