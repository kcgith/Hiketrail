import express from "express";
import { getChats, sendChat } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:activityId/chat", protect, getChats);
router.post("/:activityId/chat", protect, sendChat);

export default router;
