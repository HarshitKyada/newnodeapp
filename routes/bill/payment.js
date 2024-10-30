const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Bill = require("../../models/Bill");

const router = express?.Router();

router.post("/payment", async (req, res) => {
  const { token } = req?.headers;
  const { pay, currency, id } = req.body;
  const isAuth = await isAuthUser(token);

  if (!pay || !currency || !id) {
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

    const billIndex = billData?.invoice?.findIndex(
      (value) => value?._id.toString() === id
    );

    if (billIndex !== -1) {
      billData.invoice[billIndex].isPaid = true;
      await billData.save();

      return res.status(200).json({
        success: true,
        data: billData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Can not found invoice",
      });
    }
  } catch (err) {
    res.status(500)?.json({
      success: false,
      message: err || "Internal server error",
    });
  }
});

module.exports = router;
