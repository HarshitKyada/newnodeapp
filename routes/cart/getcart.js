const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Cart = require("../../models/Cart");

const router = express.Router();

router.get("/getcart", async (req, res) => {
  const { token } = req.headers;

  const isAuth = await isAuthUser(token);

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

    res.status(200).json({
      success: true,
      message: "Get cart API called successfully",
      data: cartData.items,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
