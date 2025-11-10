import mongoose from "mongoose";

const studentFeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  feeId: { type: mongoose.Schema.Types.ObjectId, ref: "FeeStructure", required: true },
  amountPaid: { type: Number, default: 0.0 },
  dueAmount: Number,
  paymentDate: Date,
  Voucher: String,
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "partial"],
    default: "pending"
  }
});

const StudentFee = mongoose.model("StudentFee", studentFeeSchema);

export default StudentFee