const { body } = require("express-validator");
const { getErrorMessageForMissingData } = require("./validators.utils");

exports.topicPostingValidator = [
  body("slug", getErrorMessageForMissingData("slug")).not().isEmpty(),
  body("description", getErrorMessageForMissingData("description"))
    .not()
    .isEmpty(),
  body("img_url", { status: 400, msg: "Invalid input" }).isLength({
    max: 1000,
  }),
];
