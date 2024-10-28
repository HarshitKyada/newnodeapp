const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const router = express.Router();
const Item = require("../../models/Item");

// Corrected route with a slash before :id
router.get("/getitem/:id?", async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;

  const isAuth = await isAuthUser(token);
  // Check for token presence
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  try {
    const itemSet = await Item.findOne({ user: isAuth?.email });

    if (isAuth) {
      // Handle logic based on whether an id is provided
      if (id) {
        const data = itemSet?.items?.find((value) => value?._id == id);
        return res.status(200).json({
          success: true,
          isAuth: data,
          message: "Items retrieved successfully for ID: " + id,
        });
      } else {
        return res.status(200).json({
          success: true,
          isAuth: itemSet?.items,
          message: "Items retrieved successfully for all items",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
