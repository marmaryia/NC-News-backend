const {
  fetchArticleById,
  fetchAllArticles,
} = require("../models/articles.models");

exports.getAllArticles = (request, response) => {
  fetchAllArticles().then((articles) => {
    response.status(200).send({ articles });
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
