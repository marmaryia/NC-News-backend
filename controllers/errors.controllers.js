exports.handleNonexistentPath = (request, response) => {
  response.status(404).send({ msg: "This endpoint does not exist." });
};

exports.handleServerErrors = (err, request, response, next) => {
  response.status(500).send({ msg: "Something went wrong :(" });
};

exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleDatabaseErrors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request: invalid input" });
  } else if (err.code === "23503") {
    response.status(404).send({
      msg: "Nothing found with this identifier.",
    });
  } else {
    next(err);
  }
};
