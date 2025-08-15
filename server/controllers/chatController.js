import Chat from "../models/Chat.js";

export const sendMessage = async (req, res) => {
  const { activityId, message } = req.body;

  try {
    const chat = await Chat.create({
      activity: activityId,
      user: req.user._id,
      message
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const getMessages = async (req, res) => {
  const { activityId } = req.params;

  try {
    const messages = await Chat.find({ activity: activityId }).populate("user", "name");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
