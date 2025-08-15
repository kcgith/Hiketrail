import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a message in a chat
router.post("/:activityId", protect, sendMessage);

// Get messages for an activity chat
router.get("/:activityId", protect, getMessages);

export default router;
