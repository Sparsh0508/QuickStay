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

        const uploadPromises = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
            return response.secure_url;
        })

        const images = await Promise.all(uploadPromises)

        let parsedAmenities = amenities;
        if (typeof amenities === 'string') {
            try {
                parsedAmenities = JSON.parse(amenities);
            } catch (e) {
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
        if (!hotelData) {
            return res.json({ success: false, message: "Hotel not found" });
        }
        const rooms = await Room.find({
            hotel: hotelData._id
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

// API to toggle availability of a Room

export const toggleRoomAvaibility = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId).populate('hotel')

        // Safety check to ensure owner is changing their own room
        if (!roomData || roomData.hotel.owner.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: "Unauthorized or Room not found" });
        }

        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({
            success: true,
            message: "Room Availability Updated"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to delete a Room
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id).populate('hotel');

        if (!room || room.hotel.owner.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: "Unauthorized or Room not found" });
        }

        await Room.findByIdAndDelete(id);
        res.json({ success: true, message: "Room Deleted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to update a Room
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomType, pricePerNight, amenities, isAvailable } = req.body;

        const room = await Room.findById(id).populate('hotel');

        if (!room || room.hotel.owner.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: "Unauthorized or Room not found" });
        }

        let parsedAmenities = amenities;
        if (typeof amenities === 'string') {
            try {
                parsedAmenities = JSON.parse(amenities);
            } catch (e) {
                parsedAmenities = amenities.split(',').map(item => item.trim());
            }
        }

        const updatedData = {
            roomType,
            pricePerNight: +pricePerNight,
            amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [parsedAmenities]
        };

        if (isAvailable !== undefined) {
            updatedData.isAvailable = isAvailable;
        }

        // Handle new images if any (simplified for update, usually we'd want to manage specific images)
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async (file) => {
                const response = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
                return response.secure_url;
            });
            updatedData.images = await Promise.all(uploadPromises);
        }

        await Room.findByIdAndUpdate(id, updatedData);

        res.json({ success: true, message: "Room Updated Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}