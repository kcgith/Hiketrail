import express from "express";
import {
  getAllActivities,
  getActivityById,
  createActivity,
  joinActivity,
  deleteActivity,
  updateActivity,
  leaveActivity,
  getNearbyActivities,
  getActivityParticipants,
  startActivity,
  endActivity,
  searchActivities,
  autocompleteActivities,
} from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js"; // Auth middleware

const router = express.Router();

// Create a new activity (requires login)
router.post("/create", protect, createActivity); 

// Get all activities
router.get("/", getAllActivities);

router.get("/nearby", getNearbyActivities);

router.get("/search", searchActivities);              
router.get("/autocomplete", autocompleteActivities);

// Get a single activity by ID
router.get("/:id", getActivityById);


// Join an activity (requires login)
router.post("/:id/join", protect, joinActivity);



router.get("/:activityId/participants", getActivityParticipants);

router.post("/:activityId/start", startActivity);

router.post("/:activityId/end", endActivity);

//update activity
router.put("/:id", protect, updateActivity);

//leave activity
router.post("/:id/leave", protect, leaveActivity);

// Delete an activity (requires login)
router.delete("/:id", protect, deleteActivity);

export default router;
