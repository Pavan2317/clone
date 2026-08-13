import express from "express";
import User from "../models/User.js"; // 👈 Make sure path matches your User model file location

const router = express.Router();

// Register API - Saves user to MongoDB
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered"
      });
    }

    // 2. Create new user document
    const newUser = new User({
      name,
      email,
      password,
      role: role || "candidate"
    });

    // 3. Save to MongoDB Compass
    await newUser.save();

    // 4. Return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("MongoDB Save Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message
    });
  }
});

// Login API
router.post("/login", (req, res) => {
  res.json({
    success: true,
    message: "Login API working"
  });
});

export default router;