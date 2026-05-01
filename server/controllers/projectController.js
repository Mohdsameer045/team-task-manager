const db = require("../db");

// Create Project (Admin)
exports.createProject = (req, res) => {
  const { title, description } = req.body;
  const created_by = req.user.id;

  if (!title) {
    return res.status(400).json({
      message: "Project title required"
    });
  }

  const sql =
    "INSERT INTO projects (title, description, created_by) VALUES (?,?,?)";

  db.query(
    sql,
    [title, description, created_by],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Project created successfully",
        projectId: result.insertId
      });
    }
  );
};

// Get All Projects
exports.getProjects = (req, res) => {
  const sql = `
    SELECT p.*, u.name AS createdBy
    FROM projects p
    JOIN users u ON p.created_by = u.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// Add Member to Project
exports.addMember = (req, res) => {
  const { project_id, user_id } = req.body;

  const sql =
    "INSERT INTO project_members (project_id, user_id) VALUES (?,?)";

  db.query(sql, [project_id, user_id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Member added successfully"
    });
  });
};