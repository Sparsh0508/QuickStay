import express, { Router } from "express"
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, loginUser, signupUser, storeRecentSearchedCities } from "../controllers/userControllers.js";

const userRouter = Router();

userRouter.post('/signup', signupUser);
userRouter.post('/login', loginUser);

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSearchedCities);
export default userRouter