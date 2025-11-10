import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  isbn: { type: String, },
  category: String,
  copiesAvailable: { type: Number, default: 0 }
});

const Book = mongoose.model("Book", bookSchema);
export default Book