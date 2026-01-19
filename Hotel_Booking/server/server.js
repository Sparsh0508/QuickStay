import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDb from "./configs/db.js"
import userRouter from "./routes/userRoutes.js"
import hotelRouter from "./routes/hotelRoutes.js"
import connectCloudinary from "./configs/cloudinary.js"
import roomRouter from "./routes/roomRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"

connectDb()
connectCloudinary();


const app = express()
app.use(cors()) //Enable cors origin

//MiddleWare
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}))

// Apilisten to clerk webHook

app.get('/', (req, res) => res.send("API Is Working hello "))
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)




const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
