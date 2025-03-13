const app = require("./src/app");
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});


pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error(" Connection error", err.stack));


  
app.listen(PORT, () =>  console.log(`Server running on http://localhost:${PORT}`));
