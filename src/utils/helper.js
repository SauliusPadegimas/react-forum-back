const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');

async function testDbConnection() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.query('SELECT 1');
    console.log('Connected to MYSQL DB'.bgCyan.bold);
    conn.end();
  } catch (error) {
    console.log(`Error connecting to db ${error.message}`.bgRed.bold);
  }
}

module.exports = testDbConnection;
