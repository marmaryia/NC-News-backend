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
  patchArticleById,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");
const app = express();

app.use(express.json());

app.get("/api", getAvailableEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllUsers);

app.all("/*", handleNonexistentPath);

app.use(handleCustomErrors);

app.use(handleDatabaseErrors);

app.use(handleServerErrors);

module.exports = app;
