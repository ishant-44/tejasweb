const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

// Add to cart
router.post("/add", async (req, res) => {
  const { userId, product, price } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ product, price, quantity: 1 }] });
    } else {
      const existing = cart.items.find(i => i.product === product);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({ product, price, quantity: 1 });
      }
    }
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Remove item
router.post("/remove", async (req, res) => {
  const { userId, product } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter(i => i.product !== product);
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
