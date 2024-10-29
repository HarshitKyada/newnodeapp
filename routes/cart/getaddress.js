const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Cart = require("../../models/Cart");

const router = express.Router();

router.get("/getaddress/:id?", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  try {
    const isAuth = await isAuthUser(token);
    if (!isAuth) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const getCart = await Cart.findOne({ user: isAuth.email });
    if (!getCart) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    if (!getCart.address || getCart.address.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No address found",
      });
    }

    if (id) {
      const address = getCart.address.find(
        (value) => value._id.toString() === id
      );
      if (!address) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: address,
      });
    }

    return res.status(200).json({
      success: true,
      data: getCart.address,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
