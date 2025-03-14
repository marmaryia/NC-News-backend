const { param, body, query } = require("express-validator");
const { getErrorMessageForMissingData } = require("./validators.utils");

const invalidValue = { status: 400, msg: "Invalid value" };

exports.commentIdValidator = [param("comment_id", invalidValue).isNumeric()];

exports.commentPatchingValidator = [
  body("inc_votes", getErrorMessageForMissingData("inc_votes")).not().isEmpty(),
  body("inc_votes", invalidValue).isNumeric(),
];

exports.gettingCommentsByArticleIdValidator = [
  query("limit", invalidValue).optional().isNumeric(),
  query("p", invalidValue).optional().isNumeric(),
];

exports.postingCommentByArticleIdValidator = [
  body("body", getErrorMessageForMissingData("body")).not().isEmpty(),
  body("username", getErrorMessageForMissingData("username")).not().isEmpty(),
];
