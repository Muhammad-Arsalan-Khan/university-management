import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", },
  name: { type: String, required: true },
  relation: String,
  phone: String,
  address: String
});

const Guardian = mongoose.model("Guardian", guardianSchema);

export default Guardian
