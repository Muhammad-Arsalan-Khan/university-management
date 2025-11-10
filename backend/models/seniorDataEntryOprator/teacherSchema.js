// import mongoose from "mongoose"

// const teacherSchema = new mongoose.Schema({
//   teacherId: {
//     type: String,
//     trim: true,
//   },
//   staffId: {
//     type: String,
//     trim: true,
//   },
//   qulification: {
//     type: String,
//     trim: true,
//   },
//   experience:{
//     type : String
//   },
//   specialization:{
//     type : String
//   }
// }, {
//   timestamps: true 
// });

// const teacher = mongoose.model("teacher", teacherSchema);

// export default teacher

import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true, unique: true },
  experienceYear: Number,
  qulification: String,
  specialization: String,
  universityName: String,
  passingYear: Number
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher
