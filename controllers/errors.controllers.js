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
  if (err.code) {
    response.status(400).send({ msg: "Something's wrong" });
  } else {
    next(err);
  }
};
