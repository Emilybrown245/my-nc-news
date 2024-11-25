const express = require("express");
const { getApi, getTopics } = require("./controllers/app.controller");
const { handle404s } = require("./errors");

const app = express()

app.use(express.json())

//Get requests
app.get('/api', getApi);
app.get('/api/topics', getTopics);

//Erros
app.all("*", handle404s);

module.exports = app;