const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Item = require("../../models/Item");
const Cart = require("../../models/Cart");

const router = express.Router();

router.post("/addcart", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.body;

  const auth = await isAuthUser(token);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is required",
    });
  }

  if (!auth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  const itemData = await Item.findOne({ user: auth?.email });

  if (!itemData) {
    return res.status(400).json({
      success: false,
      message: "Data not found",
    });
  }

  try {
    const item = itemData?.items.find((value) => value?._id.toString() === id);

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "Item not found",
      });
    }

    let cart = await Cart.findOne({ user: auth?.email });

    if (!cart) {
      cart = new Cart({
        user: auth?.email,
        items: [item],
      });
    } else {
      cart.items.push(item);
    }

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Item added successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
