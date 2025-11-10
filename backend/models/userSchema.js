import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  Username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6, 
  },
  role: {
    type : String,
    enum: ["HOD", "SeniorDataEntryOperator", "JuniorDataEntryOperator","feeOprator", "Librarian", "LabIncharge", "Teacher", "Student", "other"]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  userId:{
    type : String
  }
}, {
  timestamps: true 
});

const User = mongoose.model("User", userSchema);

export default User