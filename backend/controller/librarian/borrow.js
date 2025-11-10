import BorrowRecord from "../../models/Librarian/bookborrow.js";

const createBorrowRecord = async (req, res) => {
  try {
    const record = await BorrowRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBorrowRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.find()
      .populate("bookId", "title author isbn")
      .populate("studentId", "name email rollNo");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBorrowRecordById = async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id)
      .populate("bookId", "title")
      .populate("studentId", "name");
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBorrowRecord = async (req, res) => {
  try {
    const record = await BorrowRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBorrowRecord = async (req, res) => {
  try {
    const record = await BorrowRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
    createBorrowRecord,
    getAllBorrowRecords,
    getBorrowRecordById,
    updateBorrowRecord,
    deleteBorrowRecord
}