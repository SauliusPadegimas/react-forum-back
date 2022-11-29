const db = require('../utils/db');

async function selectPosts(discid) {
  const sql = 'SELECT id, text, author FROM discussions WHERE discId = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [discid]);
  return rows;
}

async function selectOnePost(id) {
  const sql = 'SELECT * FROM posts WHERE id = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [id]);
  return rows;
}

async function addPost(obj) {
  const sql = 'INSERT INTO posts (text, author, discId) VALUES (?,?,?)';
  const [rows] = await db.execute(sql, [obj.text, obj.author, obj.discId]);
  return rows;
}

module.exports = {
  selectPosts,
  selectOnePost,
  addPost,
};
