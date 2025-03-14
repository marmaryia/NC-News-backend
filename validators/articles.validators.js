const { param, body, query } = require("express-validator");
const { getErrorMessageForMissingData } = require("./validators.utils");

const invalidValue = { status: 400, msg: "Invalid value" };

exports.articleIdValidator = [param("article_id", invalidValue).isNumeric()];

exports.articlePatchingValidator = [
  body("inc_votes", getErrorMessageForMissingData("inc_votes")).not().isEmpty(),
  body("inc_votes", invalidValue).isNumeric(),
];

exports.articlePostingValidator = [
  body("author", getErrorMessageForMissingData("author")).not().isEmpty(),
  body("title", getErrorMessageForMissingData("title")).not().isEmpty(),
  body("body", getErrorMessageForMissingData("body")).not().isEmpty(),
  body("topic", getErrorMessageForMissingData("topic")).not().isEmpty(),
  body("article_img_url", { status: 400, msg: "Invalid input" }).isLength({
    max: 1000,
  }),
];

exports.articleQueriesValidator = [
  query("limit", invalidValue).optional().isNumeric(),
  query("p", invalidValue).optional().isNumeric(),
  query("order", invalidValue).optional().toLowerCase().isIn("asc", "desc"),
  query("sort_by", { status: 400, msg: "Invalid input" })
    .optional()
    .toLowerCase()
    .isIn([
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
      "article_img_url",
    ]),
];
