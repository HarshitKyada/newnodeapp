const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Cart = require("../../models/Cart");

const router = express.Router();

router.put("/updateaddress/:id", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;
  const { name, address, phonenumber, pincode } = req.body;

  const isAuth = await isAuthUser(token);

  if (!name || !address || !phonenumber || !pincode) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!isAuth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const cartData = await Cart.findOneAndUpdate(
      { user: isAuth.email, "address._id": id },
      {
        $set: {
          "address.$.name": name,
          "address.$.address": address,
          "address.$.phonenumber": phonenumber,
          "address.$.pincode": pincode,
        },
      },
      { new: true }
    );

    if (!cartData) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
