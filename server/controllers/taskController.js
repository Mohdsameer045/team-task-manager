const db = require("../db");

// =======================
// Create Task
// =======================
exports.createTask = (req, res) => {
  const {
    title,
    description,
    due_date,
    priority,
    project_id,
    assigned_to
  } = req.body;

  const created_by = req.user.id;

  if (!title || !project_id || !assigned_to) {
    return res.status(400).json({
      message: "Title, Project, Assigned User required"
    });
  }

  const findUser =
    "SELECT id FROM users WHERE id = ? OR name = ? LIMIT 1";

  db.query(findUser, [assigned_to, assigned_to], (err, userResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "User lookup failed"
      });
    }

    if (!userResult || userResult.length === 0) {
      return res.status(404).json({
        message: "Assigned user not found"
      });
    }

    const userId = userResult[0].id;

    const sql = `
      INSERT INTO tasks
      (title, description, due_date, priority, project_id, assigned_to, created_by, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        title,
        description || "",
        due_date || null,
        priority || "medium",
        project_id,
        userId,
        created_by,
        "pending"
      ],
      (err, result) => {
        if (err) {
          console.log("Create Task Error:", err);
          return res.status(500).json({
            message: "Task creation failed"
          });
        }

        res.status(201).json({
          message: "Task created successfully",
          taskId: result.insertId
        });
      }
    );
  });
};

// =======================
// Get Tasks
// =======================
exports.getTasks = (req, res) => {
  const sql = `
    SELECT 
      t.*,
      p.title AS projectName,
      u.name AS assignedUser
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    ORDER BY t.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed to load tasks"
      });
    }

    res.json(result);
  });
};

// =======================
// Update Status
// =======================
exports.updateTaskStatus = (req, res) => {
  let { status } = req.body;
  const taskId = req.params.id;

  // 🔥 convert progress -> in_progress
  if (status === "progress") {
    status = "in_progress";
  }

  // allowed statuses
  const allowed = [
    "pending",
    "in_progress",
    "completed"
  ];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  const sql =
    "UPDATE tasks SET status = ? WHERE id = ?";

  db.query(sql, [status, taskId], (err) => {
    if (err) {
      console.log("Status Error:", err);
      return res.status(500).json({
        message: "Status update failed"
      });
    }

    res.json({
      message: "Task status updated"
    });
  });
};

// =======================
// Overdue Tasks
// =======================
exports.getOverdueTasks = (req, res) => {
  const sql = `
    SELECT * FROM tasks
    WHERE due_date < CURDATE()
    AND status != 'completed'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed to load overdue tasks"
      });
    }

    res.json(result);
  });
};