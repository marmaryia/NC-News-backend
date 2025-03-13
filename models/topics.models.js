const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT slug, description FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.addTopic = (slug, description, img_url) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Incomplete data provided",
    });
  }

  return db
    .query(
      `INSERT INTO topics (slug, description, img_url) VALUES ($1, $2, $3) RETURNING *`,
      [slug, description, img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
