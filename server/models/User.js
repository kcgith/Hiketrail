import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {type : String, required: true},
  profilePic: String,
  joinedActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  createdActivities:[{type: mongoose.Schema.Types.ObjectId, ref: "Activity"}]
  
}, {timestamps:true}
);

export default mongoose.model("User", userSchema);
