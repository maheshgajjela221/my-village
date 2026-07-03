const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM news ORDER BY created_at DESC");
  res.json(result.rows);
});

router.post("/", auth, roleCheck(["sarpanch", "upa_sarpanch", "admin"]), async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const result = await pool.query(
      "INSERT INTO news (title, category, description) VALUES ($1, $2, $3) RETURNING *",
      [title, category, description]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to create news" });
  }
});

module.exports = router;
