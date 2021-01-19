// Update with your config settings. ⚙️

// Enable .env 💬
require('dotenv').config();

// DATABASE_URL env should follow this format:
// postgres://user_name:password@ipaddress:port/table
// Example: postgres://postgres:password@localhost:5432/pg_database

module.exports = {
  development: {
    client: 'pg',
    // 🔻 Points to our local Postgresql database
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
  },
};
