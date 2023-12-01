import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    roomsDetail: {
        type: Object,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    }
}, {timestamps: true});

bookingSchema.index({roomsDetail:1, startDate:1}, {unique:true});

export default mongoose.model("Booking", bookingSchema);