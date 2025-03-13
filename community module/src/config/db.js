const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, 
    },
});

// pool.query("SELECT 1", (err, res) => {
//     if (err) console.error("Database connection error:", err);
//     else console.log("Connected to database!");
// });

module.exports = pool;
