const {
  deleteCommentById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchCommentById,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router({ mergeParams: true });

commentsRouter
  .route("/")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = commentsRouter;
