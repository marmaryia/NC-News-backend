const { getAllTopics } = require("../controllers/topics.controllers");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getAllTopics);

module.exports = topicsRouter;
