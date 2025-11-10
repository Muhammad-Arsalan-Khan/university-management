// import mongoose from "mongoose"

// const departSchema = new mongoose.Schema({
//   departId: {
//     type: String,
//     trim: true,
//   },
//   departHeadId: {
//     type: String,
//     trim: true,
//   },
//   deapartName: {
//     type: String,
//     trim: true,
//   },
//   phone:{
//     type : String
//   },
//   location:{
//     type : String
//   }
// }, {
//   timestamps: true 
// });

// const depart = mongoose.model("depart", departSchema);

// export default depart

import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  departmentHeadId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  officeLocation: String,
  phone: String
});

const Department = mongoose.model("Department", departmentSchema);

export default Department
