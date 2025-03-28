const mysql = require ("mysql2");
const dbConfig = require("../config/db.config.js");

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
    console.log("Successfully connected to the database.");
});

const db = connection.promise();

module.exports = db;