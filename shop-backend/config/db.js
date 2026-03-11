const { Pool } = require('pg');

// Connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test connection
pool.connect()
  .then(client => {
      console.log("Connected to PostgreSQL database");
      client.release();
  })
  .catch(err => {
      console.error("Database connection error:", err.stack);
  });


module.exports = pool;