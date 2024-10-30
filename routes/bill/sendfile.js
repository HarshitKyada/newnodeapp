const express = require("express");
const path = require("path"); // Import the path module
const router = express.Router();

router.get("/sendfile", (_, res) => {
  try {
    const htmlFilePath = path.join(__dirname, "../../htmlfile/index.html");
    res.sendFile(htmlFilePath, (err) => {
      if (err) {
        res.status(err.status).end();
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err || "Internal server error",
    });
  }
});

module.exports = router;
