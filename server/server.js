import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import locationRoutes from "./routes/locationRoutes.js";
import socketHandler from "./socket/socketHandler.js";
import UserRoutes from "./routes/UserRoutes.js";


dotenv.config();

const app = express();
const server = http.createServer(app); // Create server for socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {console.log("MongoDB Connected")
    console.log("DB NAME:", mongoose.connection.name);
    console.log("DB HOST:", mongoose.connection.host);
  })
  .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/activities", chatRoutes);
app.use("/api/location", locationRoutes);


app.get("/", (req, res) => {
  res.send("API is working");
});

socketHandler(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});