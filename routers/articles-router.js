const {
  getAllArticles,
  getArticleById,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controllers");
const commentsRouter = require("./comments-router");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articlesRouter.use("/:article_id/comments", commentsRouter);

module.exports = articlesRouter;
