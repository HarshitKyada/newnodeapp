// models/Item.js

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
});

// Use mongoose.models to prevent overwriting the model
const Item = mongoose.models.Item || mongoose.model("Item", authSchema);

module.exports = Item;
