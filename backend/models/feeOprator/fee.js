import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
  tuitionFee: { type: Number, default: 0.0 },
  examFee: { type: Number, default: 0.0 },
  libraryFee: { type: Number, default: 0.0 }
});

// Virtual field (auto total)
feeStructureSchema.virtual("totalFee").get(function () {
  return this.tuitionFee + this.examFee + this.libraryFee;
});

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);

export default FeeStructure