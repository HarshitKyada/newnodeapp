const express = require("express");
const Item = require("../../models/Item");
const { isAuthUser } = require("../../utils/auth");

const router = express.Router();

router.put("/updateitem/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;
  const { name, category, price } = req.body;

  const auth = await isAuthUser(token);

  if (!auth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const userItems = await Item.findOne({ user: auth.email });

    if (!userItems) {
      return res.status(404).json({
        success: false,
        message: "No items found for this user.",
      });
    }

    const itemIndex = userItems.items.findIndex(
      (item) => item._id.toString() === id
    );

    if (itemIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Item not found",
      });
    }

    userItems.items[itemIndex] = {
      ...userItems.items[itemIndex],
      name: name,
      category: category,
      price: price,
    };

    await userItems.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
