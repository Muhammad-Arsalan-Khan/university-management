import FeeStructure from "../../models/feeOprator/fee.js";

const getFeeStructures = async (req, res) => {
  try {
    const fees = await FeeStructure.find()
      .populate("programId", "programName")
      .populate("semesterId", "semesterNumber");
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFeeStructure = async (req, res) => {
  try {
    const fee = await FeeStructure.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const modifyFeeStructure = async (req, res) => {
  try {
    const fee = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ message: "Fee structure not found" });
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFeeStructure = async (req, res) => {
  try {
    const fee = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee structure not found" });
    res.status(200).json({ message: "Fee structure deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
    deleteFeeStructure,
    modifyFeeStructure,
    createFeeStructure,
    getFeeStructures
}