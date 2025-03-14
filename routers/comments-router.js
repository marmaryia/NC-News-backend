const {
  deleteCommentById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchCommentById,
} = require("../controllers/comments.controllers");
const { articleIdValidator } = require("../validators/articles.validators");
const {
  commentIdValidator,
  commentPatchingValidator,
  gettingCommentsByArticleIdValidator,
  postingCommentByArticleIdValidator,
} = require("../validators/comments.validators");

const commentsRouter = require("express").Router({ mergeParams: true });

commentsRouter
  .route("/")
  .all(articleIdValidator)
  .get(gettingCommentsByArticleIdValidator, getCommentsByArticleId)
  .post(postingCommentByArticleIdValidator, postCommentByArticleId);

commentsRouter
  .route("/:comment_id")
  .all(commentIdValidator)
  .delete(deleteCommentById)
  .patch(commentPatchingValidator, patchCommentById);

module.exports = commentsRouter;
