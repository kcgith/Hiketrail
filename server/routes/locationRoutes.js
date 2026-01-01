import express from "express";
import LiveLocation from "../models/LiveLocation.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ---- UPDATE USER LOCATION (optional fallback for frontend refresh) ----
router.post("/update", protect, async (req, res) => {
  try {
    const { activityId, latitude, longitude, accuracy, heading, speed } = req.body;

    const location = await LiveLocation.findOneAndUpdate(
      { userId: req.user._id },
      { activityId, latitude, longitude, accuracy, heading, speed },
      { new: true, upsert: true }
    );

    res.json({ success: true, location });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ---- GET ALL GROUP MEMBER LOCATIONS ----
router.get("/activity/:activityId", protect, async (req, res) => {
  try {
    const { activityId } = req.params;

    const locations = await LiveLocation.find({ activityId })
      .populate("userId", "name");

    res.json({ success: true, locations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
