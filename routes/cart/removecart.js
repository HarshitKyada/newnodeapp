const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Cart = require("../../models/Cart");

const router = express.Router();

router.delete("/removecart/:id", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  const isAuth = await isAuthUser(token);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is required",
    });
  }

  if (!isAuth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const cartData = await Cart.findOne({
      user: isAuth?.email,
    });

    if (!cartData) {
      return res.status(400).json({
        success: false,
        message: "No data available",
      });
    }

    // Filter out the item with the specified ID
    cartData.items = cartData.items.filter(
      (item) => item._id.toString() !== id
    );

    await cartData.save();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
