const {
  deleteCommentById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router({ mergeParams: true });

commentsRouter.get("/", getCommentsByArticleId);
commentsRouter.post("/", postCommentByArticleId);
commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
