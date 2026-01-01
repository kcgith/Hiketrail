import express from "express";
import { getProfile, getJoinedActivities, getCreatedActivities } from "../controllers/UserController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/:id/created-activities", getCreatedActivities);
router.get("/:id/joined-activities", getJoinedActivities);


export default router;
