const format = require("pg-format");
const db = require("../db/connection");
const { checkExists } = require("../app.utils");

exports.fetchAllArticles = (sort_by, order, topic, limit, p, otherQueries) => {
  if (Object.keys(otherQueries).length !== 0) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: the query is not supported",
    });
  }

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, 
                  articles.created_at, articles.votes, articles.article_img_url,
                  CAST (COUNT(comments.comment_id) AS INT) AS comment_count
                  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const sqlQueryEnd = ` GROUP BY articles.article_id
                        ORDER BY %I %s
                        LIMIT %L
                        OFFSET %L`;
  let sqlQueryForTotal = `SELECT CAST(COUNT (*) AS INT) AS total_count FROM articles`;
  const queryValues = [];
  const promises = [];
  sort_by = sort_by || "created_at";
  order = order || "DESC";
  limit = limit || 10;
  const offsetValue = limit * ((p || 1) - 1);

  if (topic) {
    promises.push(checkExists("topics", "slug", topic));
    queryValues.push(topic);
    sqlQuery += ` WHERE topic = $1`;
    sqlQueryForTotal += ` WHERE topic = $1`;
  }

  sqlQuery += sqlQueryEnd;
  const formattedSqlQuery = format(
    sqlQuery,
    sort_by,
    order,
    limit,
    offsetValue
  );

  promises.unshift(db.query(sqlQueryForTotal, queryValues));
  promises.unshift(db.query(formattedSqlQuery, queryValues));
  return Promise.all(promises).then(([articlesRows, totalCount]) => {
    const articles = articlesRows.rows;
    const { total_count } = totalCount.rows[0];
    return { articles, total_count };
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
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
  if (!author || !title || !body || !topic) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Incomplete data provided",
    });
  }
  const sqlString = `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

  return db
    .query(sqlString, [author, title, body, topic, article_img_url])
    .then(({ rows }) => {
      rows[0].comment_count = 0;
      return rows[0];
    });
};

exports.removeArticleById = (article_id) => {
  return checkExists("articles", "article_id", article_id).then(() => {
    return db.query(`DELETE FROM articles WHERE article_id = $1`, [article_id]);
  });
};
