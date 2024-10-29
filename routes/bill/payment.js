const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Bill = require("../../models/Bill");

const router = express?.Router();

router.post("/payment", async (req, res) => {
  const { token } = req?.headers;
  const { pay, currency } = req.body;
  const isAuth = await isAuthUser(token);

  if (!pay || !currency) {
    res.status(404).json({
      success: false,
      message: "All fields require",
    });
  }

  if (!isAuth) {
    res.status(401).json({
      success: false,
      message: "Unauthorize user",
    });
  }

  try {
    const billData = await Bill.findOne({
      user: isAuth?.email,
    });
    res.status(200).json({
      success: true,
      data: billData,
    });
  } catch (err) {}
});

module.exports = router;
