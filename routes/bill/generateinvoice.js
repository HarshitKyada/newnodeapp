const express = require("express");
const { isAuthUser } = require("../../utils/auth");
const Bill = require("../../models/Bill");
const Cart = require("../../models/Cart");

const router = express.Router();

router.post("/generateinvoice", async (req, res) => {
  const { token } = req.headers;
  const { id, addressId } = req.body;

  const isAuth = await isAuthUser(token);

  if (!id) {
    return res.status(404).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!isAuth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const billData = await Bill.findOne({ user: isAuth?.email });
    const cartData = await Cart.findOne({ user: isAuth?.email });

    const selectedAddress = cartData?.address?.find(
      (value) => value?._id.toString() === addressId
    );

    const allItem = cartData?.items || [];

    const priceArray = allItem?.map((value) => value?.price);

    const price = Number(priceArray.reduce((acc, price) => acc + price, 0));
    const gst = price * 0.18;
    const shippingCharge = 120;
    const totalBill = price + gst + shippingCharge;

    console.log("totalBill", totalBill);

    if (!billData) {
      const newBill = new Bill({
        user: isAuth?.email,
        invoice: [
          {
            address: selectedAddress,
            items: allItem,
            price: price,
            text: 18,
            shippingCharge: shippingCharge,
            totalPrice: Math.round(totalBill),
          },
        ],
      });

      await newBill.save();

      return res.status(201).json({
        success: true,
        message: "Invoice generated successfully",
      });
    } else {
      billData.invoice.push({
        address: selectedAddress,
        items: allItem,
        price: price,
        text: 18,
        shippingCharge: shippingCharge,
        totalPrice: Math.round(totalBill),
      });

      await billData.save();

      return res.status(201).json({
        success: true,
        message: "Invoice generated successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

module.exports = router;
