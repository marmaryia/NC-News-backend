const format = require("pg-format");
const { checkExists } = require("../app.utils");
const db = require("../db/connection");
const { fetchArticleById } = require("./articles.models");
const { check } = require("express-validator");

exports.fetchCommentsByArticleId = (article_id, limit, p) => {
  limit = limit || 10;
  const offsetValue = limit * ((p || 1) - 1);
  const sqlString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT %L OFFSET %L`;
  const formattedSqlString = format(sqlString, limit, offsetValue);
  const promises = [
    db.query(formattedSqlString, [article_id]),
    fetchArticleById(article_id),
  ];
  return Promise.all(promises).then(([{ rows }]) => {
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
  const sqlString = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`;
  const promises = [
    db.query(sqlString, [inc_votes, comment_id]),
    checkExists("comments", "comment_id", comment_id),
  ];
  return Promise.all(promises).then(([{ rows }]) => {
    return rows[0];
  });
};
