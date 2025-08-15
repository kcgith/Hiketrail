import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/chat", chatRoutes);  

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(5000, () => console.log("Server running on port 5000"));
