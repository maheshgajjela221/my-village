const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const wards = Array.from({ length: 14 }, (_, index) => ({
    ward_no: index + 1,
    name: `Ward ${index + 1}`,
  }));

  res.json(wards);
});

module.exports = router;
