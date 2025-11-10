import LabLog from "../../models/lab/lab.js"


const markEntry = async (req, res) => {
  try {
    const { userId } = req.body;
    const existingLog = await LabLog.findOne({ userId, leaveTime: { $exists: false } });
    if (existingLog) {
      return res.status(400).json({ message: "User already entered and not left yet" });
    }
    const log = await LabLog.create({ userId });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const markExit = async (req, res) => {
  try {
    const { userId } = req.body;
    const log = await LabLog.findOne({ userId, leaveTime: { $exists: false } });
    if (!log) {
      return res.status(404).json({ message: "No active session found for this user" });
    }
    log.leaveTime = new Date();
    await log.save();
    res.status(200).json({ message: "Leave time recorded successfully", log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLogs = async (req, res) => {
  try {
    const logs = await LabLog.find().populate("userId", "username role");
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
    markEntry,
    markExit,
    getAllLogs,
}