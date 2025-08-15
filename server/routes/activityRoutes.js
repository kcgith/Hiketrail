import express from "express";
import {
  getAllActivities,
  getActivityById,
  createActivity,
  joinActivity,
  deleteActivity
} from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js"; // Auth middleware

const router = express.Router();

// Create a new activity (requires login)
router.post("/", protect, createActivity); 

// Get all activities
router.get("/", getAllActivities);

// Get a single activity by ID
router.get("/:id", getActivityById);



// Join an activity (requires login)
router.post("/:id/join", protect, joinActivity);

// Delete an activity (requires login)
router.delete("/:id", protect, deleteActivity);

export default router;
