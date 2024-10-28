// models/Auth.js

const mongoose = require("mongoose");

// Define the schema
const authSchema = new mongoose.Schema({
  username: {type: String || Number},
  email: { type: String },
  password:  { type: String },
  token: {type: String}
});

// Use mongoose.models to prevent overwriting the model
const Auth = mongoose.models.Auth || mongoose.model("Auth", authSchema);

module.exports = Auth;
