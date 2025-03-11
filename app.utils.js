const format = require("pg-format");
const db = require("./db/connection");

exports.checkExists = (table, column, value) => {
  const sqlQuery = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  return db.query(sqlQuery, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Nothing found with this identifier.",
      });
    }
  });
};
