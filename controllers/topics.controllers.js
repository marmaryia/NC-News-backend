const { fetchAllTopics, addTopic } = require("../models/topics.models");

exports.getAllTopics = (request, response) => {
  fetchAllTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

exports.postTopic = (request, response, next) => {
  const { slug, description, img_url } = request.body;
  addTopic(slug, description, img_url)
    .then((topic) => {
      response.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
