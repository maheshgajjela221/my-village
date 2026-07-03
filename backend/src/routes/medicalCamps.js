const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM medical_camps ORDER BY camp_date ASC");
  res.json(result.rows);
});

router.post("/", auth, roleCheck(["sarpanch", "upa_sarpanch", "admin"]), async (req, res) => {
  try {
    const { title, camp_date, location, doctor_name, description } = req.body;
    const result = await pool.query(
      "INSERT INTO medical_camps (title, camp_date, location, doctor_name, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, camp_date, location, doctor_name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to create medical camp" });
  }
});

module.exports = router;
