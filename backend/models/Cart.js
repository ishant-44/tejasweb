const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: String,
      price: Number,
      quantity: Number,
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);
