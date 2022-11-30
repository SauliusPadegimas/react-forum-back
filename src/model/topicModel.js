const db = require('../utils/db');

async function selectTopics() {
  const sql =
    'SELECT topics.id, topics.title, COUNT(discussions.id) AS length FROM topics LEFT JOIN discussions ON (topics.id = discussions.topicId) GROUP BY topics.id';
  // parsisiusti pilna postu info
  const [rows] = await db.query(sql);
  return rows;
}

async function selectOneTopic(name) {
  const sql = 'SELECT * FROM topics WHERE title = ?';
  // parsisiusti pilna postu info
  const [rows] = await db.execute(sql, [name]);
  return rows;
}

module.exports = {
  selectTopics,
  selectOneTopic,
};
