exports.handleNonexistentPath = (request, response) => {
  response.status(404).send({ msg: "This endpoint does not exist." });
};
