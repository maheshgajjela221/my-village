const bcrypt = require("bcryptjs");
const pool = require("./config/db");

async function seed() {
  try {
    const sarpanchPassword = await bcrypt.hash("sarpanch123", 10);
    const upaPassword = await bcrypt.hash("upasarpanch123", 10);

    await pool.query(
      `INSERT INTO users (name, phone, password_hash, role, ward_no)
       VALUES
       ($1, $2, $3, $4, NULL),
       ($5, $6, $7, $8, NULL)
       ON CONFLICT (phone) DO NOTHING`,
      [
        "Rechini Sarpanch",
        "9000000001",
        sarpanchPassword,
        "sarpanch",
        "Rechini Upa-Sarpanch",
        "9000000002",
        upaPassword,
        "upa_sarpanch",
      ]
    );

    await pool.query(
      `INSERT INTO news (title, category, description)
       VALUES
       ('Pension Status Update', 'Pensions', 'Old age, widow, disabled and single women pension verification list is available at village office.'),
       ('Ration Distribution', 'Ration', 'Monthly ration distribution date and stock details will be updated ward-wise.'),
       ('Farmer Support Program', 'Farmers', 'Information about seeds, fertilizers and agriculture schemes.')
       ON CONFLICT DO NOTHING`
    );

    await pool.query(
      `INSERT INTO events (title, event_date, location, description)
       VALUES
       ('Village Development Meeting', '2026-05-30', 'Gram Panchayat Office', 'Discussion about roads, street lights, water supply and development works.'),
       ('Ration Card Verification', '2026-06-05', 'Ration Shop', 'Villagers can verify ration card details and supply status.')
       ON CONFLICT DO NOTHING`
    );

    await pool.query(
      `INSERT INTO medical_camps (title, camp_date, location, doctor_name, description)
       VALUES
       ('Free Medical Camp', '2026-06-02', 'Government School Ground', 'Government Health Team', 'Free BP, sugar, eye checkup and general consultation.')
       ON CONFLICT DO NOTHING`
    );

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
