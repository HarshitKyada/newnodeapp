// models/Cart.js

const mongoose = require("mongoose");

// Define the schema
const authSchema = new mongoose.Schema({
  user: { type: String },
  items: [
    {
      name: { type: String },
      category: { type: String },
      price: { type: String || Number },
    },
  ],
  address: [
    {
      name: { type: String },
      address: { type: String },
      phonenumber: { type: String || Number },
      pincode: { type: String || Number },
    },
  ],
});

// Use mongoose.models to prevent overwriting the model
const Cart = mongoose.models.Cart || mongoose.model("Cart", authSchema);

module.exports = Cart;
