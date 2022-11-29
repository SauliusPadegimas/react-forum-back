const dbConfig = {
  user: 'doadmin',
  password: process.env.DB_PASSWORD,
  host: 'db-mysql-saulius-do-user-12339382-0.b.db.ondigitalocean.com',
  port: 25060,
  database: 'ForumDB',
  // sslmode: 'REQUIRED',
};
module.exports = dbConfig;
