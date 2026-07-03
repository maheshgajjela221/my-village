const fs = require("fs");
const path = require("path");
const pool = require("./config/db");

async function migrate() {
  try {
    const schemaPath = path.join(__dirname, "sql", "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(sql);
    console.log("Database migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
