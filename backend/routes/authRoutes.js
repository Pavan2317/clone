import express from "express";
import User from "../models/User.js"; // Make sure the path matches your User model file location

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

// ✅ FIXED: Login API - Authenticates user and returns actual user data
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user in MongoDB by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "User not found with this email" 
      });
    }

    // 2. Check if password matches
    if (user.password !== password) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid password" 
      });
    }

    // 3. Send back success response with user info (so frontend can display name)
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login",
      error: error.message 
    });
  }
});

export default router;
