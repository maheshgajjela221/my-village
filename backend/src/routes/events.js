const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM events ORDER BY event_date ASC");
  res.json(result.rows);
});

router.post("/", auth, roleCheck(["sarpanch", "upa_sarpanch", "admin"]), async (req, res) => {
  try {
    const { title, event_date, location, description } = req.body;
    const result = await pool.query(
      "INSERT INTO events (title, event_date, location, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, event_date, location, description]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to create event" });
  }
});

module.exports = router;
