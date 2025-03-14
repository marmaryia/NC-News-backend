const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT slug, description FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.addTopic = (slug, description, img_url) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then(({ rows }) => {
      if (rows.length !== 0) {
        return Promise.reject({ status: 400, msg: "Invalid input" });
      }
    })
    .then(() => {
      return db
        .query(
          `INSERT INTO topics (slug, description, img_url) VALUES ($1, $2, $3) RETURNING *`,
          [slug, description, img_url]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};
