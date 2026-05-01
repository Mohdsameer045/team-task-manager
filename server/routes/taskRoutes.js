const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowRole = require("../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus,
  getOverdueTasks
} = require("../controllers/taskController");

// Admin only
router.post(
  "/create",
  verifyToken,
  allowRole("admin"),
  createTask
);

// Logged in users
router.get(
  "/all",
  verifyToken,
  getTasks
);

// Logged in users
router.put(
  "/status/:id",
  verifyToken,
  updateTaskStatus
);

// Logged in users
router.get(
  "/overdue",
  verifyToken,
  getOverdueTasks
);

module.exports = router;