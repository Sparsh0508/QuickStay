import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvaibility, deleteRoom, updateRoom } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post('/', upload.array("images", 4), protect, createRoom)
roomRouter.get('/', getRooms)
roomRouter.get('/owner', protect, getOwnerRooms)
roomRouter.post('/toggle-availability', protect, toggleRoomAvaibility)
roomRouter.delete('/:id', protect, deleteRoom)
roomRouter.put('/:id', upload.array("images", 4), protect, updateRoom)



export default roomRouter