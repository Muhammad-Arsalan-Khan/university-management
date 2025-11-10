import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  payDate: { type: Date, default: Date.now }
});

// Virtual net pay
payrollSchema.virtual("netPay").get(function () {
  return (this.basicSalary || 0) + (this.allowances || 0) - (this.deductions || 0);
});

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll
