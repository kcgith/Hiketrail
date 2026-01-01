import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {type: String, required: true},
  description : {type: String},
  type: { type: String},
  location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true } // [lng, lat]
    },
  date: {type: Date,
      required: true},

  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: {
  type: String,
  enum: ["upcoming", "ongoing", "completed"],
  default: "upcoming"
},
  startedAt: Date,
  endedAt: Date,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  liveLocations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        coords: {
          lat: Number,
          lng: Number,
        },
        updatedAt: { type: Date, default: Date.now },
      },
    ], 
  }, { timestamps: true } 
)
activitySchema.index({ location: "2dsphere" });

export default mongoose.model("Activity", activitySchema);
