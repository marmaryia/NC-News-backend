const express = require("express");
const { getAvailableEndpoints } = require("./controllers/api.controllers");
const {
  handleNonexistentPath,
  handleServerErrors,
} = require("./controllers/errors.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");
const app = express();

app.get("/api", getAvailableEndpoints);

app.get("/api/topics", getAllTopics);

app.all("/*", handleNonexistentPath);

app.use(handleServerErrors);

module.exports = app;
