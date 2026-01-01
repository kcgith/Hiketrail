// socket/socketHandler.js
import Chat from "../models/Chat.js";
import LiveLocation from "../models/LiveLocation.js";

export default function socketHandler(io) {

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN ACTIVITY ROOM
    socket.on("joinActivityRoom", (activityId) => {
      const roomName = `activity_${activityId}`;
      socket.join(roomName);
      console.log(`User joined room: ${roomName}`);
    });

    // CHAT MESSAGE
    socket.on("sendMessage", async ({ activityId, message, userId }) => {
      try {
        const newMsg = await Chat.create({
          activityId,
          sender: userId,
          message,
        });

        io.to(`activity_${activityId}`).emit("messageReceived", newMsg);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // LIVE LOCATION
    socket.on("sendLocation", async (data) => {
      const {
        userId,
        activityId,
        latitude,
        longitude,
        accuracy,
        heading,
        speed
      } = data;

      const roomName = `activity_${activityId}`;

      // Update DB
      await LiveLocation.findOneAndUpdate(
        { userId },
        { activityId, latitude, longitude, accuracy, heading, speed },
        { upsert: true }
      );

      // Broadcast to room
      io.to(roomName).emit("locationUpdate", {
        userId,
        latitude,
        longitude,
        accuracy,
        heading,
        speed,
        updatedAt: new Date()
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
