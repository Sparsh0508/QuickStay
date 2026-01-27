import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { messageInRaw } from "svix";


const checkAvaibility = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate }
        })
        const isAvailable = bookings.length === 0;
        return isAvailable
    } catch (error) {
        console.error(error.message)
    }
}

export const checkAvaibilityApi = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvaibility({ checkInDate, checkOutDate, room })
        res.json({
            success: true,
            isAvailable
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// APi to create a new booking
// post /api/bookings/book

export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        const isAvailable = await checkAvaibility({ checkInDate, checkOutDate, room })

        if (!isAvailable) {
            return res.json({
                success: false,
                message: "Room is not Available"
            })
        }
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

        totalPrice *= nights

        const booking = await Booking.create({
            user, room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })
        res.json({
            success: true,
            message: "Booking created Successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "failed to create booking"
        })
        console.error(error)
    }
}

// APi to get all bookings for  a user
// Get /api/bookings/user 

export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 })
        res.json({
            success: true, bookings
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Failed to fetch bookings"
        })
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({
            owner: req.user._id
        })
        if (!hotel) {
            return res.json({
                success: false,
                message: "No Hotel Found"
            })
        }
        const bookings = await Booking.find({
            hotel: hotel._id
        }).populate("room hotel user").sort({ createdAt: -1 })

        const totalBookings = bookings.length;

        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        res.json({
            success: true,
            dashboardata: {
                totalBookings, totalRevenue, bookings
            }
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Failed to fetch bookings"
        })
    }
}