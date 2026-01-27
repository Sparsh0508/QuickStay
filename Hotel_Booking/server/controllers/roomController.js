// API to create a new Room 

import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js"

export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;

        const hotel = await Hotel.findOne({
            owner: req.user._id
        })

        if (!hotel) {
            return res.json({
                success: false,
                message: "No Hotel Found. Please register a hotel first."
            })
        }

        if (!req.files || req.files.length === 0) {
            return res.json({
                success: false,
                message: "Please upload at least one image."
            })
        }

        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

        const images = await Promise.all(uploadImages)

        let parsedAmenities = amenities;
        if (typeof amenities === 'string') {
            try {
                parsedAmenities = JSON.parse(amenities);
            } catch (e) {
                // If it's a string but not JSON, maybe it's a comma separated list or just a single value
                parsedAmenities = amenities.split(',').map(item => item.trim());
            }
        }

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [parsedAmenities],
            images
        })

        res.json({
            success: true,
            message: "Room Created Successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// Api to get all rooms

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({
            isAvailable: true
        }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 })
        res.json({
            success: true,
            rooms
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to get room for a specific hotel

export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({
            owner: req.user._id
        })
        const rooms = await Room.find({
            hotel: hotelData._id.toString()
        }).populate("hotel");
        res.json({
            success: true,
            rooms
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to toggle avaibility of a Room

export const toggleRoomAvaibility = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId)
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({
            success: true,
            message: "Room Avaibility Updated"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}