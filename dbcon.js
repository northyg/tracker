// removed host, user, pw, and database for posting to github

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : '-',
  user            : '-',
  password        : '-',
  database        : '-'
});

module.exports.pool = pool;
