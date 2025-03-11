const db = require("../db/connection");

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, 
        articles.created_at, articles.votes, articles.article_img_url,
        CAST (COUNT(comments.comment_id) AS INT) as comment_count FROM articles 
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.author, articles.title, articles.article_id, articles.topic, 
        articles.created_at, articles.votes, articles.article_img_url
        ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "The item requested does not exist in the database",
        });
      }
      return rows[0];
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  const sqlString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  const promises = [
    db.query(sqlString, [inc_votes, article_id]),
    this.fetchArticleById(article_id),
  ];
  return Promise.all(promises).then(([{ rows }]) => {
    return rows[0];
  });
};
