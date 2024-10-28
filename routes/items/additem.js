const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Item = require("../../models/Item");

const router = express.Router();

router.post("/additem", async (req, res) => {
  const { token } = req.headers;
  const { name, category, price } = req.body;

  try {
    const auth = await isAuthUser(token);
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // Correct usage of findOne
    const itemSet = await Item.findOne({ user: auth?.email });

    if (!itemSet) {
      // Create new item set if none exists
      const item = new Item({
        user: auth?.email,
        items: [
          {
            name: name,
            category: category,
            price: price,
          },
        ],
      });
      await item.save();
    } else {
      // Add item to existing item set
      itemSet.items.push({
        name: name,
        category: category,
        price: price,
      });
      await itemSet.save();
    }

    res.status(201).json({
      success: true,
      message: "Item posted successfully",
    });
  } catch (err) {
    console.error("Error during item addition:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

module.exports = router;
