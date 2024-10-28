const express = require("express");
const Item = require("../../models/Item");
const { isAuthUser } = require("../../utils/auth");

const router = express.Router();

router.delete("/deleteitem/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;

  const auth = await isAuthUser(token);

  if (!auth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    // Fetch the item for the authenticated user
    const userItems = await Item.findOne({ user: auth.email });

    if (!userItems) {
      return res.status(404).json({
        success: false,
        message: "No items found for this user.",
      });
    }

    // Filter out the item to delete
    const updatedItems = userItems.items.filter(
      (item) => item._id.toString() !== id
    );

    // Update the user's items
    userItems.items = updatedItems;
    await userItems.save();

    if (userItems.items.length !== updatedItems?.length) {
      res.status(200).json({
        success: true,
        message: "Item deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Data not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
