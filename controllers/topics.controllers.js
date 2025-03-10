const { fetchAllTopics } = require("../models/topics.models");

exports.getAllTopics = (request, response) => {
  fetchAllTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};
