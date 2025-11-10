import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["quiz", "assignment"],
    required: true
  },
  totalMarks: { type: Number},
  weightage: Number,
  assessmentDate: Date,
  fileURL: String,
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" }
});


const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment