const express = require("express");
const { isAuthUser } = require("../../utils/auth");

const router = express.Router();

router.post("/trackorder", async (req, res) => {
  const { token } = req?.headers;

  const isAuth = await isAuthUser(token);

  if (!isAuth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorize user",
    });
  }

  try {
    res.status(200).json({
      success: true,
      message: "You are an user",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err || "Internal server error",
    });
  }
});

module.exports = router;
