import User from "../models/User.js"


export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("createdActivities")     // activities created by user
      .populate("joinedActivities");     // activities user joined

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCreatedActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ createdBy: req.params.id });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getJoinedActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ participants: req.params.id });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
