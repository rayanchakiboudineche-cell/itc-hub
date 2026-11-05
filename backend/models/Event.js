import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  department: String,
  capacity: { type: Number, default: 50 },
});

export default mongoose.model("Event", eventSchema);