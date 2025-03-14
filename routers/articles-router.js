const {
  getAllArticles,
  getArticleById,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controllers");
const commentsRouter = require("./comments-router");
const {
  articleIdValidator,
  articlePatchingValidator,
  articlePostingValidator,
  articleQueriesValidator,
} = require("../validators/articles.validators");

const articlesRouter = require("express").Router();

articlesRouter
  .route("/")
  .get(articleQueriesValidator, getAllArticles)
  .post(articlePostingValidator, postArticle);

articlesRouter
  .route("/:article_id")
  .all(articleIdValidator)
  .get(getArticleById)
  .patch(articlePatchingValidator, patchArticleById)
  .delete(deleteArticleById);

articlesRouter.use("/:article_id/comments", commentsRouter);

module.exports = articlesRouter;
