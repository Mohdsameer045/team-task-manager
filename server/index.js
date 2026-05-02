const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
require("./db");

/* CORS FIX */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://frontend-6133.up.railway.app",
      "https://taskmanager-sm.up.railway.app"
    ],
    credentials: true
  })
);

app.use(express.json());

/* Routes */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});