import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  issueDate: { type: Date, default: Date.now },
  returnDate: Date,
  fineAmount: { type: Number, default: 0.0 }
});

const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);

export default BorrowRecord