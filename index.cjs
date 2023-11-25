import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import authRoute from "./routes/auth.js"
import roomsRoute from "./routes/rooms.js";
import bookingRoute from "./routes/booking.js";
import cookieParser from "cookie-parser";
import path from "path";

const app = express()
const port = process.env.PORT || 8000;
 
const connect = async function() {
try {
    await mongoose.connect(process.env.MONGO, {useNewUrlParser:true, useUnifiedTopology:true});
    console.log("Connected to MongoDB.")
  } catch (error) {
    throw error
  }
}

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,"client","build")));

app.use("/users", usersRoute);
app.use("/hotels", hotelsRoute);
app.use("/api/auth", authRoute);
app.use("/rooms", roomsRoute);
app.use("/booking", bookingRoute);

//errors middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong."
  res.status(errorStatus).json({
    "success":"false",
    "status":errorStatus,
    "message": errorMessage,
    "stack": err.stack
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client","build","index.html"));
});

app.listen(port, function() {
    connect()
    console.log("Server connected on port 8000.");
});