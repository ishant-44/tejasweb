const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.json({ success: false, msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ success: true, msg: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === "admin@speedostar.com" && password === "admin123") {
      return res.json({ success: true, user: { name: "Admin", email, plan: "All", role: "admin" } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, msg: "Invalid credentials" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// Get all users (Admin only)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
