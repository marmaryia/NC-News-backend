const express = require("express");
const { getAvailableEndpoints } = require("./controllers/api.controllers");
const {
  handleNonexistentPath,
  handleServerErrors,
  handleCustomErrors,
  handleDatabaseErrors,
} = require("./controllers/errors.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
} = require("./controllers/comments.controllers");
const app = express();

app.get("/api", getAvailableEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/*", handleNonexistentPath);

app.use(handleCustomErrors);

app.use(handleDatabaseErrors);

app.use(handleServerErrors);

module.exports = app;
