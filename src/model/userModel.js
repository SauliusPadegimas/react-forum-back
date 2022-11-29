const db = require('../utils/db');

async function selectUsers() {
  const sql = 'SELECT * FROM users';
  // parsisiusti pilna postu info
  const [rows] = await db.query(sql);
  return rows;
}

async function selectUser(secret) {
  const sql = 'SELECT * FROM Users WHERE secret = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [secret]);
  return rows;
}

async function selectUserName(username) {
  const sql = 'SELECT * FROM Users WHERE username = ?';
  const [rows] = await db.execute(sql, [username]);
  return rows;
}

async function selectUsersPosts() {
  const sql =
    'SELECT u_id, email, bio, town, COUNT(p_id) AS posts FROM Users LEFT JOIN posts ON u_id = user_id GROUP BY u_id';
  // parsisiusti pilna postu info
  const [rows] = await db.query(sql);
  return rows;
}

async function insertUser({ username, password, secret }) {
  const sql = 'INSERT INTO Users (`username`, `password`, `secret`) VALUES (?,?,?)';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [username, password, secret]);
  return rows;
}

module.exports = {
  selectUsers,
  selectUser,
  selectUserName,
  selectUsersPosts,
  insertUser,
};
