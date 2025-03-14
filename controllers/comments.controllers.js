const { validationResult } = require("express-validator");
const {
  fetchCommentsByArticleId,
  addCommentByArticleId,
  removeCommentById,
  updateCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (request, response, next) => {
  const { errors } = validationResult(request);
  if (errors.length !== 0) {
    return next(errors[0].msg);
  }

  const { article_id } = request.params;
  const { limit, p } = request.query;

  fetchCommentsByArticleId(article_id, limit, p)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (request, response, next) => {
  const { errors } = validationResult(request);
  if (errors.length !== 0) {
    return next(errors[0].msg);
  }

  const { article_id } = request.params;
  const { username, body } = request.body;
  addCommentByArticleId(article_id, username, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (request, response, next) => {
  const { errors } = validationResult(request);
  if (errors.length !== 0) {
    return next(errors[0].msg);
  }

  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (request, response, next) => {
  const { errors } = validationResult(request);
  if (errors.length !== 0) {
    return next(errors[0].msg);
  }

  const { comment_id } = request.params;
  const { inc_votes } = request.body;
  updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
