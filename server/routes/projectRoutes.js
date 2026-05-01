const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRole = require("../middleware/roleMiddleware");

const {
  createProject,
  getProjects,
  addMember
} = require("../controllers/projectController");

// Admin only
router.post(
  "/create",
  verifyToken,
  allowRole("admin"),
  createProject
);

// Logged-in users
router.get(
  "/all",
  verifyToken,
  getProjects
);

// Admin only
router.post(
  "/add-member",
  verifyToken,
  allowRole("admin"),
  addMember
);

module.exports = router;