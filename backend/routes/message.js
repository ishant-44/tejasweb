const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, text } = req.body;
  try {
    const message = new Message({ name, email, text });
    await message.save();
    res.json({ success: true, msg: "Message saved!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
