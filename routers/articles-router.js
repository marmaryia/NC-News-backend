const {
  getAllArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controllers");
const commentsRouter = require("./comments-router");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);

articlesRouter.use("/:article_id/comments", commentsRouter);

module.exports = articlesRouter;
