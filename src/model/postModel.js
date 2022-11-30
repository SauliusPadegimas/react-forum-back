const db = require('../utils/db');

async function selectPosts(discid) {
  const sql =
    'SELECT posts.id, text, username, image, replying, time FROM posts JOIN Users ON (author = Users.id) WHERE discId = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [discid]);
  return rows;
}

async function selectOnePost(id) {
  const sql =
    'SELECT posts.id, text, time, replying, discId, author, Users.username FROM posts JOIN Users ON(author = Users.id) WHERE posts.id = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [id]);
  return rows;
}

async function addPost(obj) {
  const sql = 'INSERT INTO posts (text, author, discId, replying) VALUES (?,?,?,?)';
  const [rows] = await db.execute(sql, [obj.text, obj.author, obj.discId, obj.replying]);
  return rows;
}

module.exports = {
  selectPosts,
  selectOnePost,
  addPost,
};

// SELECT DISTINCT author, COUNT(posts.id) FROM `posts` JOIN Users ON (author = Users.id) GROUP BY author
