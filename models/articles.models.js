const format = require("pg-format");
const db = require("../db/connection");
const { checkExists } = require("../app.utils");

exports.fetchAllArticles = (sort_by, order, topic) => {
  const queryValues = [];
  const promises = [];
  sort_by = sort_by || "created_at";
  order = order || "DESC";

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, 
                    articles.created_at, articles.votes, articles.article_img_url,
                    CAST (COUNT(comments.comment_id) AS INT) as comment_count FROM articles 
              LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const sqlQueryEnd = ` GROUP BY articles.author, articles.title, articles.article_id, articles.topic, 
              articles.created_at, articles.votes, articles.article_img_url
              ORDER BY %I %s`;

  if (topic) {
    promises.push(checkExists("topics", "slug", topic));
    queryValues.push(topic);
    sqlQuery += ` WHERE topic = $1`;
  }

  sqlQuery += sqlQueryEnd;
  const formattedSqlQuery = format(sqlQuery, sort_by, order);
  promises.unshift(db.query(formattedSqlQuery, queryValues));
  return Promise.all(promises).then(([{ rows }]) => {
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
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: incomplete data provided",
    });
  }
  const sqlString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  const promises = [
    db.query(sqlString, [inc_votes, article_id]),
    this.fetchArticleById(article_id),
  ];
  return Promise.all(promises).then(([{ rows }]) => {
    return rows[0];
  });
};
