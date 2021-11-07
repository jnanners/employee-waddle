const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Keishaisnumber1.",
        database: "waddle_db"
    }
)

module.exports = db;