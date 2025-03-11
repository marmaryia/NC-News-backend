const { checkExists } = require("../app.utils");
const db = require("../db/connection");
const { fetchArticleById } = require("./articles.models");

exports.fetchCommentsByArticleId = (article_id) => {
  const queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
  const promises = [
    db.query(queryString, [article_id]),
    fetchArticleById(article_id),
  ];
  return Promise.all(promises).then(([{ rows }]) => {
    return rows;
  });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Incomplete data provided",
    });
  }

  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return checkExists("comments", "comment_id", comment_id).then(() => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
  });
};
