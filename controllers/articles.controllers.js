const { fetchArticleById } = require("../models/articles.models");

exports.getArticleById = (request, response) => {
  const { article_id } = request.params;
  fetchArticleById(article_id).then((article) => {
    console.log(article);
    response.status(200).send({ article });
  });
};
