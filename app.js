const express = require("express");
const cors = require("cors");

const {
  handleNonexistentPath,
  handleServerErrors,
  handleCustomErrors,
  handleDatabaseErrors,
} = require("./controllers/errors.controllers");

const apiRouter = require("./routers/api-router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleNonexistentPath);

app.use(handleCustomErrors);

app.use(handleDatabaseErrors);

app.use(handleServerErrors);

module.exports = app;
