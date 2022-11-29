const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');

const db = mysql.createPool({
  ...dbConfig,
  // %%% ZEMIAU ESANTYS NEBUTINI, NES TURI TOKIAS REIKSMES BY DEFAULT
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});

// const db = pool.promise(); ---JEIGU VIRSUI DAROM mysql2 BE PROMISE DALIES, TAI TADA REIKIA SITO

module.exports = db;
