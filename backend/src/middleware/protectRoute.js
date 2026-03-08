import { requireAuth } from "@clerk/express";
import User from "../models/user.model.js";

export const protectRoute = [
  requireAuth({signInUrl: "/"}),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      // find the user in the database
      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log("Error in protect route middleware: ", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
];
