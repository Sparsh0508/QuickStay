import mongoose from "mongoose";
import Hotel from "./Hotel.js";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["Pay At Hotel", "Online"],
        default: "Pay At Hotel"
    },
    isPaid: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;