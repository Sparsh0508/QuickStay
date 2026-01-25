import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ success: false, message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(_id).select("_id role recentSearchCity");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Request is not authorized" });
  }
};


