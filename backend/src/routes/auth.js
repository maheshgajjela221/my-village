const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, ward_no } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone and password are required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, phone, password_hash, role, ward_no)
       VALUES ($1, $2, $3, 'villager', $4)
       RETURNING id, name, phone, role, ward_no`,
      [name, phone, passwordHash, ward_no || null]
    );

    res.status(201).json({ message: "Registration successful", user: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Phone number already registered" });
    }
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }

    const payload = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      ward_no: user.ward_no,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({ message: "Login successful", token, user: payload });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
