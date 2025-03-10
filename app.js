const express = require("express");
const { getAvailableEndpoints } = require("./controllers/api.controllers");
const { handleNonexistentPath } = require("./controllers/errors.controllers");
const app = express();

app.get("/api", getAvailableEndpoints);

app.all("/*", handleNonexistentPath);

module.exports = app;
