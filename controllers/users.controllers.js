const {
  fetchAllUsers,
  fetchUserByUsername,
} = require("../models/users.models");

exports.getAllUsers = (request, response) => {
  fetchAllUsers().then((users) => {
    response.status(200).send({ users });
  });
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  fetchUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
