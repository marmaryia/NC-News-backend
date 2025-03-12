const {
  getAllArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controllers");
const commentsRouter = require("./comments-router");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter.use("/:article_id/comments", commentsRouter);

module.exports = articlesRouter;
