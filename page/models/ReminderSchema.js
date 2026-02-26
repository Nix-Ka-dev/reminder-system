import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  hour: Number,
  minute: Number,
  name: String,
  content: String,

  taskCounts: [
    {
      personId: { type: mongoose.Schema.Types.ObjectId, ref: "Persons" },
      count: { type: Number, default: 0 }
    }
  ]
});

reminderSchema.index({ name: 1}, { unique: true });

export default mongoose.model("Reminder", reminderSchema);