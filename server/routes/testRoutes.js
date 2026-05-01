const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRole = require("../middleware/roleMiddleware");

// Any logged-in user
router.get("/user", verifyToken, (req, res) => {
  res.json({
    message: "Welcome User",
    user: req.user
  });
});

// Only admin
router.get(
  "/admin",
  verifyToken,
  allowRole("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin"
    });
  }
);

module.exports = router;