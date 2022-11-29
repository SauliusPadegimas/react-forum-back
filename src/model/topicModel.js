const db = require('../utils/db');

async function selectTopics() {
  const sql =
    'SELECT topics.id, topics.title, COUNT(discussions.id) AS length FROM topics JOIN discussions ON (topics.id = discussions.topicId) GROUP BY topics.id';
  // parsisiusti pilna postu info
  const [rows] = await db.query(sql);
  return rows;
}

async function selectOneTopic(id) {
  const sql = 'SELECT * FROM topics WHERE id = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [id]);
  return rows;
}

module.exports = {
  selectTopics,
  selectOneTopic,
};
