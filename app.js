const express = require("express");
const { getApi } = require("./controllers/app.controller");

const app = express()

app.use(express.json())

app.get('/api', getApi);

module.exports = app;