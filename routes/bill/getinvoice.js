const express = require("express");
const Bill = require("../../models/Bill");
const { isAuthUser } = require("../../utils/auth");

const router = express.Router();

router.get("/getinvoice/:id?", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  const isAuth = await isAuthUser(token);

  if (!isAuth) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const invoiceData = await Bill.findOne({ user: isAuth.email });
    if (!invoiceData) {
      return res
        .status(404)
        .json({ success: false, message: "No invoice found" });
    }

    if (id) {
      const data = invoiceData.invoice?.find(
        (value) => value._id.toString() === id
      );
      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "Invoice not found" });
      }
      return res.status(200).json({
        success: true,
        data: data,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: invoiceData.invoice,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
