exports.handleNonexistentPath = (request, response) => {
  response.status(404).send({ msg: "This endpoint does not exist." });
};

exports.handleServerErrors = (err, request, response, next) => {
  response.status(500).send({ msg: "Something went wrong :(" });
};
