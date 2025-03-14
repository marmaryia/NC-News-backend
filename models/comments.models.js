const format = require("pg-format");
const { checkExists } = require("../app.utils");
const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id, limit, p) => {
  return checkExists("articles", "article_id", article_id)
    .then(() => {
      limit = limit || 10;
      const offsetValue = limit * ((p || 1) - 1);
      const sqlString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT %L OFFSET %L`;
      const formattedSqlString = format(sqlString, limit, offsetValue);
      return db.query(formattedSqlString, [article_id]);
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  return Promise.all([
    checkExists("articles", "article_id", article_id),
    checkExists("users", "username", username),
  ])
    .then(() => {
      return db.query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
        [article_id, username, body]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return checkExists("comments", "comment_id", comment_id).then(() => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
  });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return checkExists("comments", "comment_id", comment_id)
    .then(() => {
      const sqlString = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`;
      return db.query(sqlString, [inc_votes, comment_id]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
