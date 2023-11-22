import express from "express";
import { createBooking, getBookings, deleteBooking, getBooking } from "../controllers/booking.js";
import { verifyUser } from "../utils/verifyToken.js";    

const router = express.Router();

//CREATE
router.post("/:id", verifyUser, createBooking);

//GET BOOKINGS
router.get("/:id", verifyUser, getBookings);

//GET BOOKINGS
router.get("/:id/:bookingId", verifyUser, getBooking);

//DELETE BOOKING
router.delete("/:id/:bookingId", verifyUser, deleteBooking);
export default router;