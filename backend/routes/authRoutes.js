import express from "express";

const router = express.Router();

// Register API
router.post("/register", (req, res) => {
  res.json({
    success: true,
    message: "Register API working"
  });
});

// Login API
router.post("/login", (req, res) => {
  res.json({
    success: true,
    message: "Login API working"
  });
});

export default router;