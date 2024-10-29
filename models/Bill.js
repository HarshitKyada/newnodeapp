// models/Bill.js

const mongoose = require("mongoose");

// Define the schema
const authSchema = new mongoose.Schema({
  user: { type: String || Number },
  invoice: [
    {
      address: {
        name: { type: String },
        address: { type: String },
        phonenumber: { type: String || Number },
        pincode: { type: String || Number },
      },
      items: [
        {
          name: { type: String },
          category: { type: String },
          price: { type: String || Number },
        },
      ],
      price: { type: String || Number },
      text: { type: String || Number },
      shippingCharge: { type: String || Number },
      totalPrice: { type: String || Number },
    },
  ],
});

// Use mongoose.models to prevent overwriting the model
const Bill = mongoose.models.Bill || mongoose.model("Bill", authSchema);

module.exports = Bill;
