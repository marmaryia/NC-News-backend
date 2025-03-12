const format = require("pg-format");
const db = require("../db/connection");
const { checkExists } = require("../app.utils");

exports.fetchAllArticles = (sort_by, order, topic, otherQueries) => {
  if (Object.keys(otherQueries).length !== 0) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: the query is not supported",
    });
  }

  const queryValues = [];
  const promises = [];
  sort_by = sort_by || "created_at";
  order = order || "DESC";

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, 
                    articles.created_at, articles.votes, articles.article_img_url,
                    CAST (COUNT(comments.comment_id) AS INT) AS comment_count
                    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const sqlQueryEnd = ` GROUP BY articles.article_id
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
    .query(
      `SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [article_id]
    )
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
    checkExists("articles", "article_id", article_id),
  ];
  return Promise.all(promises).then(([{ rows }]) => {
    return rows[0];
  });
};

exports.addArticle = (author, title, body, topic, article_img_url) => {
  const sqlString = `WITH temporary_table AS (INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *)
                    SELECT temporary_table.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
                    FROM temporary_table LEFT JOIN comments ON temporary_table.article_id = comments.article_id
                    GROUP BY temporary_table.article_id, temporary_table.title, temporary_table.topic, temporary_table.author, temporary_table.votes, temporary_table.body, temporary_table.created_at, temporary_table.article_img_url;`;

  return db
    .query(sqlString, [author, title, body, topic, article_img_url])
    .then(({ rows }) => {
      return rows[0];
    });
};
