const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Cart = require("../../models/Cart");

const router = express.Router();

router.post("/addaddress", async (req, res) => {
  const { token } = req.headers;
  const { name, address, phonenumber, pincode } = req.body;

  if (!name || !address || !phonenumber || !pincode) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const isAuth = await isAuthUser(token);

  // Check for authorization
  if (!isAuth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const cartData = await Cart.findOne({ user: isAuth.email });

    // Check if the cart exists for the user
    if (!cartData) {
      return res.status(404).json({
        success: false,
        message: "There is nothing in the cart, so you cannot add an address",
      });
    }

    // Add address to the cart
    if (!cartData.address) {
      cartData.address = [{ name, address, phonenumber, pincode }];
    } else {
      cartData.address.push({ name, address, phonenumber, pincode });
    }

    await cartData.save();

    return res.status(200).json({
      success: true,
      message: "Address added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
