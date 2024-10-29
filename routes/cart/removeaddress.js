const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Cart = require("../../models/Cart");

const router = express.Router();

router.delete("/removeaddress/:id", async (req, res) => {
  console.log('first')
  const { token } = req.headers;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is required",
    });
  }

  const isAuth = await isAuthUser(token);

  if (!isAuth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const cartData = await Cart.findOne({ user: isAuth.email });

    if (!cartData) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    const isRemoved = cartData.address.some(
      (value) => value._id.toString() === id
    );

    if (!isRemoved) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Filter out the address with the given ID
    cartData.address = cartData.address.filter(
      (value) => value._id.toString() !== id
    );

    await cartData.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
