import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";

export const createBooking = async (req, res, next) => {
    const userId = req.params.id;

    const newBooking = new Booking(req.body);

    try {
        const savedBooking = await newBooking.save();
        try{
            const user = await User.findByIdAndUpdate(userId, { $push: {bookings: savedBooking._id}});
            if (!user) {
                next(createError(404, "User not found"));
            };
        } catch (err) {
            next(err)
        }
        res.status(200).json(savedBooking);
    } catch(err) {
        next(err);
    }
};

export const deleteBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            next(createError(404, "Booking not found"))
        };
        try {
            const eachDaySelected = (start, end) => {
                const day = new Date(start);
                const list = [];
                while ( day < end ) {
                    list.push(day.getTime());
                    day.setDate(day.getDate() + 1);
                };
                return list 
            };
            const allDates = eachDaySelected(booking.startDate, booking.endDate);
            const rooms = Object.values(booking.roomsDetail).flat();
            await Promise.all(rooms.map(room => {
                return Room.updateOne({"roomNumbers._id" :room}, {$pull: {"roomNumbers.$.unavailableDates": {$in : allDates}}})
            }));
            try {
                await Booking.findByIdAndDelete(bookingId);
                res.status(200).send("Booking cancelled")
            } catch (err) {
                next(err)
            }
        } catch (err) {
            next(err)
        }
    } catch (err) {
        next(err)
    }
};

export const getBookings = async (req, res, next) => {
    const userId = req.params.id;

    try{
        const user = await User.findById(userId);
        if (!user) {
            next(createError(404, "User not found"))
        }
        try {
            const bookings = await Booking.find({user: userId}).populate('hotel');
            res.status(200).json(bookings);
        } catch(err) {
            next(err);
        }
    } catch(err){
        next(err);
    }
};

export const getBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;

    try{
        const booking = await Booking.findById(bookingId).populate('hotel');
        res.status(200).json(booking);
    } catch(err) {
        next(err)
    }
}