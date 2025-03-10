const endpoints = require("../endpoints.json");

exports.getAvailableEndpoints = (request, response) => {
  response.status(200).send({ endpoints });
};
