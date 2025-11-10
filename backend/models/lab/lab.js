import mongoose from "mongoose";

const labLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  entryTime: { 
    type: Date, 
    default: Date.now 
  },
  leaveTime: { 
    type: Date 
  },
  date: { 
    type: String, 
    default: () => new Date().toISOString().split("T")[0] // yyyy-mm-dd
  }
});

const LabLog = mongoose.model("LabLog", labLogSchema);
export default LabLog;
