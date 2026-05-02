const db = require("../db");

// =======================
// Create Project
// =======================
exports.createProject = (req, res) => {
  try {
    const { title, description } = req.body;
    const created_by = req.user.id;

    if (!title) {
      return res.status(400).json({
        message: "Project title required"
      });
    }

    const sql =
      "INSERT INTO projects (title, description, created_by) VALUES (?, ?, ?)";

    db.query(sql, [title, description, created_by], (err, result) => {
      if (err) {
        console.log("Create Project Error:", err);
        return res.status(500).json({
          message: "Project creation failed"
        });
      }

      res.status(201).json({
        message: "Project created successfully",
        projectId: result.insertId
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// =======================
// Get All Projects
// =======================
exports.getProjects = (req, res) => {
  try {
    const sql = `
      SELECT p.*, u.name AS createdBy
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      ORDER BY p.id DESC
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.log("Get Projects Error:", err);
        return res.status(500).json({
          message: "Failed to load projects"
        });
      }

      res.json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// =======================
// Add Member
// =======================
exports.addMember = (req, res) => {
  try {
    const { project_id, user_id } = req.body;

    const sql =
      "INSERT INTO project_members (project_id, user_id) VALUES (?, ?)";

    db.query(sql, [project_id, user_id], (err) => {
      if (err) {
        console.log("Add Member Error:", err);
        return res.status(500).json({
          message: "Failed to add member"
        });
      }

      res.json({
        message: "Member added successfully"
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};