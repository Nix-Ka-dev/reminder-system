import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  date: Date,
  person: String,
  type: String,
  hour: Number,
  minute: Number,
  content: String
});

export default mongoose.model("Tasks", taskSchema);