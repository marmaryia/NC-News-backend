const { param, body, query } = require("express-validator");
const db = require("./db/connection");
const { checkExists } = require("./app.utils");
const incompleteData = { status: 400, msg: "Incomplete data provided" };
const invalidValue = { status: 400, msg: "Invalid value" };

exports.articleIdValidator = [param("article_id", invalidValue).isNumeric()];

exports.articlePatchingValidator = [
  body("inc_votes", incompleteData).not().isEmpty(),
  body("inc_votes", invalidValue).isNumeric(),
];

exports.articlePostingValidator = [
  body("author", incompleteData).not().isEmpty(),
  body("title", incompleteData).not().isEmpty(),
  body("body", incompleteData).not().isEmpty(),
  body("topic", incompleteData).not().isEmpty(),
  body("article_img_url", { status: 400, msg: "Invalid input" }).isLength({
    max: 1000,
  }),
];

exports.articleQueriesValidator = [
  query("limit", invalidValue).custom((value) => {
    return !value || !isNaN(value);
  }),
  query("p", invalidValue).custom((value) => {
    return !value || !isNaN(value);
  }),
  query("order", invalidValue).custom((value) => {
    return !value || ["asc", "desc"].includes(value.toLowerCase());
  }),
  query("topic").custom((value) => {
    return value ? checkExists("topics", "slug", value) : true;
  }),
  query("sort_by").custom((value) => {
    if (!value) {
      return true;
    }
    return db
      .query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'articles'`
      )
      .then(({ rows }) => {
        if (!rows.map((row) => row.column_name).includes(value)) {
          return Promise.reject({ status: 400, msg: "Invalid input" });
        }
      });
  }),
];
