import Chat from '../models/Chat.js'

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      activity: req.params.activityId, // ✅ FIX
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load chat messages" });
  }
};

export const sendChat = async (req, res) => {
    // console.log("PARAMS:", req.params); 
    // console.log("BODY:", req.body);

  try {
    const newChat = await Chat.create({
      activity: req.params.activityId, // ✅ FIX
      sender: req.user._id,
      text: req.body.text,
    });

    res.json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send chat" });
  }
};
