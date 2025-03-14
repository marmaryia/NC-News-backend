const {
  getAllTopics,
  postTopic,
} = require("../controllers/topics.controllers");
const { topicPostingValidator } = require("../validators/topics.validators");

const topicsRouter = require("express").Router();

topicsRouter
  .route("/")
  .get(getAllTopics)
  .post(topicPostingValidator, postTopic);

module.exports = topicsRouter;
