if (process.env.NODE_ENV === "production") {
  throw new Error("Seeding not allowed in production");
}


import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

dotenv.config();

/* ---------------- CONNECT ---------------- */
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

/* ---------------- USERS ---------------- */
const usersData = [
  { name: "Aarav", email: "aarav@test.com" },
  { name: "Diya", email: "diya@test.com" },
  { name: "Rahul", email: "rahul@test.com" },
  { name: "Sneha", email: "sneha@test.com" },
  { name: "Karthik", email: "karthik@test.com" },
  { name: "Ananya", email: "ananya@test.com" },
  { name: "Vikram", email: "vikram@test.com" },
  { name: "Meera", email: "meera@test.com" },
];

/* ---------------- ACTIVITIES ---------------- */
const activitiesData = [
  {
    title: "Nandi Hills Sunrise Trek",
    description: "Early morning trek to watch sunrise",
    type: "trek",
    location: { coordinates: [77.6835, 13.3702] },
  },
  {
    title: "Cubbon Park Morning Run",
    description: "5km easy paced run",
    type: "run",
    location: { coordinates: [77.5920, 12.9763] },
  },
  {
    title: "Lalbagh Picnic",
    description: "Relaxed picnic with board games",
    type: "picnic",
    location: { coordinates: [77.5848, 12.9507] },
  },
  {
    title: "Savandurga Adventure Hike",
    description: "Rocky terrain hike",
    type: "adventure",
    location: { coordinates: [77.2945, 12.9229] },
  },
  {
    title: "Badminton Indoor Games",
    description: "Doubles badminton matches",
    type: "indoor",
    location: { coordinates: [77.6412, 12.9352] },
  },
  {
    title: "Ramanagara Day Hike",
    description: "Short hike & photography",
    type: "hike",
    location: { coordinates: [77.2816, 12.7225] },
  },
  {
    title: "Goa Beach Meetup",
    description: "Beach walk & sunset",
    type: "random",
    location: { coordinates: [73.8567, 15.2993] },
  },
  {
    title: "Coorg Nature Trail",
    description: "Weekend nature exploration",
    type: "trek",
    location: { coordinates: [75.8069, 12.3375] },
  },
];

/* ---------------- CREATE USERS IF NOT EXIST ---------------- */
const users = [];

for (let data of usersData) {
  let user = await User.findOne({ email: data.email });

  if (!user) {
    user = await User.create({
      ...data,
      password: "hashedpassword123", // dummy
    });
    console.log(`User created: ${user.email}`);
  } else {
    console.log(`User exists: ${user.email}`);
  }

  users.push(user);
}

/* ---------------- CREATE ACTIVITIES IF NOT EXIST ---------------- */
for (let data of activitiesData) {
  const exists = await Activity.findOne({ title: data.title });
  if (exists) {
    console.log(`Activity exists: ${data.title}`);
    continue;
  }

  const creator = users[Math.floor(Math.random() * users.length)];

  const activity = await Activity.create({
    ...data,
    date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
    createdBy: creator._id,
    participants: users
      .filter(u => u._id.toString() !== creator._id.toString())
      .slice(0, Math.floor(Math.random() * 4))
      .map(u => u._id),
  });

  await User.findByIdAndUpdate(creator._id, {
    $addToSet: { createdActivities: activity._id },
  });

  console.log(`Activity created: ${activity.title}`);
}

console.log("Safe seeding complete ✅");
process.exit();
