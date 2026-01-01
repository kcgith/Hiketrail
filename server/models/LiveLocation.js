import mongoose from "mongoose";

const liveLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true
  },
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  heading: Number,
  speed: Number,
  updatedAt: { type: Date, default: Date.now }
});

// auto-update timestamp
liveLocationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("LiveLocation", liveLocationSchema);
