const db = require("../db");

// Create Task (Admin)
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

  const sql = `
    INSERT INTO tasks
    (title, description, due_date, priority, project_id, assigned_to, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      description,
      due_date,
      priority,
      project_id,
      assigned_to,
      created_by
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Task created successfully",
        taskId: result.insertId
      });
    }
  );
};

// Get All Tasks
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
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// Update Status
exports.updateTaskStatus = (req, res) => {
  const { status } = req.body;
  const taskId = req.params.id;

  const sql =
    "UPDATE tasks SET status = ? WHERE id = ?";

  db.query(sql, [status, taskId], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Task status updated"
    });
  });
};

// Overdue Tasks
exports.getOverdueTasks = (req, res) => {
  const sql = `
    SELECT * FROM tasks
    WHERE due_date < CURDATE()
    AND status != 'completed'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};