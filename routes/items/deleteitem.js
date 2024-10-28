const express = require("express");
const Item = require("../../models/Item");
const { isAuthUser } = require("../../utils/auth");

const router = express.Router();

router.delete("/deleteitem/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;

  // Authenticate the user
  const auth = await isAuthUser(token);
  if (!auth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    // Fetch the user's items
    const userItems = await Item.findOne({ user: auth.email });
    if (!userItems) {
      return res.status(404).json({
        success: false,
        message: "No items found for this user.",
      });
    }

    // Check if the item exists in the user's items
    const itemExists = userItems.items.some(
      (item) => item._id.toString() === id
    );
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found for this user.",
      });
    }

    // Filter out the item to delete
    userItems.items = userItems.items.filter(
      (item) => item._id.toString() !== id
    );

    // Save the updated items
    await userItems.save();

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
