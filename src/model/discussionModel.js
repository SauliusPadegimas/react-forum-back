const db = require('../utils/db');

async function selectDiscussions(topicname) {
  const sql =
    "SELECT discussions.id, discussions.title, username, (SELECT posts.time FROM posts WHERE posts.discId = discussions.id AND posts.time >= ALL(SELECT posts.time FROM posts WHERE posts.discId = discussions.id)) AS 'lastPost' FROM discussions JOIN Users ON (Users.id = discussions.author) JOIN topics ON (discussions.topicId = topics.id) WHERE topics.title = ? GROUP BY discussions.id";
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [topicname]);
  return rows;
}

async function selectOneDiscussion(id) {
  const sql = 'SELECT * FROM discussions WHERE id = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [id]);
  return rows;
}

async function addDiscussion(obj) {
  const sql = 'INSERT INTO discussions (title, author, topicId) VALUES (?,?,?)';
  const [rows] = await db.execute(sql, [obj.title, obj.author, obj.topicId]);
  return rows;
}

module.exports = {
  selectDiscussions,
  selectOneDiscussion,
  addDiscussion,
};
