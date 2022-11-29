const db = require('../utils/db');

async function selectDiscussions(topicid) {
  const sql = 'SELECT id, title, author FROM discussions WHERE topicId = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [topicid]);
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
