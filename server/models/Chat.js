// models/chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      
    },
    message: {
      type: String,
      
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
