import StudentFee from "../../models/feeOprator/studentfee.js"


const getStudentFees = async (req, res) => {
  try {
    const fees = await StudentFee.find()
      .populate("studentId", "fullname email")
      .populate("feeId");
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentFeeByStudentId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const fees = await StudentFee.find({ studentId : id })
      .populate("studentId", "fullname email")
      .populate({
        path: "feeId",
        populate: [
          { path: "programId", select: "programName" },
          { path: "semesterId", select: "semesterNumber" }
        ]
      });
      console.log(fees)
    if (!fees.length) {
      return res.status(404).json({ message: "No fee records found for this student" });
    }
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createStudentFee = async (req, res) => {
  try {
    const fee = await StudentFee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const modifyStudentFee = async (req, res) => {
  try {
    const fee = await StudentFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ message: "Student fee record not found" });
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudentFee = async (req, res) => {
  try {
    const fee = await StudentFee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ message: "Student fee record not found" });
    res.status(200).json({ message: "Student fee record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export {
    deleteStudentFee,
    modifyStudentFee,
    createStudentFee,
    getStudentFees,
    getStudentFeeByStudentId
}