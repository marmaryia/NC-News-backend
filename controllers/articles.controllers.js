const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleById,
  addArticle,
} = require("../models/articles.models");

exports.getAllArticles = (request, response, next) => {
  const { sort_by, order, topic, limit, p, ...otherQueries } = request.query;

  fetchAllArticles(sort_by, order, topic, limit, p, otherQueries)
    .then(({ articles, total_count }) => {
      response.status(200).send({ articles, total_count });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (request, response, next) => {
  const { author, title, body, topic, article_img_url } = request.body;
  addArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
