require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASS),
  port: 5432,
});

client.connect()
  .then(() => console.log("DB connected successfully"))
  .catch(err => {
    console.log("DB connection error:", err);
  });

module.exports = client;