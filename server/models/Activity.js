import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {type: String, required: true},
  type: { type: String},
  location: String,
  date: Date,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  }})

export default mongoose.model("Activity", activitySchema);
