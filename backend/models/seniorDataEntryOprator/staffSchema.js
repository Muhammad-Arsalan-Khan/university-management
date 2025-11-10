// import mongoose from "mongoose"

// const staffSchema = new mongoose.Schema({
//   staffId: {
//     type: String,
//     trim: true,
//   },
//   userId: {
//     type: String,
//     trim: true,
//   },
//   FullName: {
//     type: String,
//     trim: true,
//   },
//   gender: {
//     type : String,
//     enum: ["male", "female", "other"]
//   },
//   email: {
//     type: Boolean,
//     trim: true,
//   },
//   phone:{
//     type : String
//   },
//   hireDate:{
//     type : Date
//   },
//   designation:{
//     type : String,
//     enum: ["JuniorDataEntryOperator", "Librarian", "LabIncharge", "Teacher", "other"]
//   },
//   departId:{
//     type : String
//   },
//   salary:{
//     type : String
//   }
// }, {
//   timestamps: true 
// });

// const staff = mongoose.model("staff", staffSchema);

// export default staff

import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
  email: { type: String, required: true, unique: true },
  phone: String,
  hireDate: Date,
  designation: String,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  salary: Number
});

const Staff = mongoose.model("Staff", staffSchema);

export default Staff

