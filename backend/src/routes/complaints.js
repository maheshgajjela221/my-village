const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, ward_no, category, message } = req.body;

    if (!name || !phone || !ward_no || !category || !message) {
      return res.status(400).json({ message: "All complaint fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO complaints (name, phone, ward_no, category, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, ward_no, category, status, created_at`,
      [name, phone, ward_no, category, message]
    );

    res.status(201).json({
      message: "Complaint submitted successfully. It is visible only to Sarpanch and Upa-Sarpanch.",
      complaint: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Complaint submission failed" });
  }
});

router.get(
  "/",
  auth,
  roleCheck(["sarpanch", "upa_sarpanch", "admin"]),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM complaints ORDER BY created_at DESC`
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  }
);

router.patch(
  "/:id",
  auth,
  roleCheck(["sarpanch", "upa_sarpanch", "admin"]),
  async (req, res) => {
    try {
      const { status, leader_note } = req.body;

      const result = await pool.query(
        `UPDATE complaints
         SET status = COALESCE($1, status),
             leader_note = COALESCE($2, leader_note),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [status, leader_note, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      res.json({ message: "Complaint updated", complaint: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: "Failed to update complaint" });
    }
  }
);

module.exports = router;
