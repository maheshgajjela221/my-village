const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const newsRoutes = require("./routes/news");
const eventRoutes = require("./routes/events");
const medicalCampRoutes = require("./routes/medicalCamps");
const wardRoutes = require("./routes/wards");

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Rechini Village API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/medical-camps", medicalCampRoutes);
app.use("/api/wards", wardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Rechini Village backend running on port ${PORT}`);
});
