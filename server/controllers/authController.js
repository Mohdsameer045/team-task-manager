const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================
// Signup
// ======================
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields required"
    });
  }

  const checkUser = "SELECT * FROM users WHERE email = ?";

  db.query(checkUser, [email], async (err, result) => {
    if (err) {
      console.log("Signup Check Error:", err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (result && result.length > 0) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql =
        "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";

      db.query(
        sql,
        [name, email, hashedPassword, role || "member"],
        (err) => {
          if (err) {
            console.log("Signup Insert Error:", err);
            return res.status(500).json({
              message: "Signup failed"
            });
          }

          res.status(201).json({
            message: "User Registered Successfully"
          });
        }
      );
    } catch (error) {
      console.log("Hash Error:", error);
      return res.status(500).json({
        message: "Server error"
      });
    }
  });
};

// ======================
// Login
// ======================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log("Login Error:", err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid Password"
        });
      }

      const SECRET =
        process.env.JWT_SECRET || "mysecretkey123";

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role
        },
        SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "Login Success",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.log("Login Compare Error:", error);
      return res.status(500).json({
        message: "Server error"
      });
    }
  });
};