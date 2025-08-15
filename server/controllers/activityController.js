import Activity from "../models/Activity.js";

// Create a new activity
export const createActivity = async (req, res) => {
  try {
    const activity = new Activity({
      ...req.body,
      createdBy: req.user.id
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack});
  }
};

// Get all activities
export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("createdBy", "name email")
      .populate("participants", "name email");
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// Get activity by ID
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Join an activity
export const joinActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    if (activity.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "You have already joined this activity" });
    }

    activity.participants.push(req.user.id);
    await activity.save();

    res.json({ message: "Joined successfully", activity });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an activity
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    if (activity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this activity" });
    }

    await activity.deleteOne();
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
