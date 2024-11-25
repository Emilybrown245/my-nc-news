const express = require("express");
const { getApi, getTopics, getArticleById } = require("./controllers/app.controller");
const { handle404s, handleArticleIdNotFound, handle400s  } = require("./errors");

const app = express()

app.use(express.json())

//Get requests
app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

//Errors
app.all("*", handle404s);

app.use(handleArticleIdNotFound);
app.use(handle400s);

module.exports = app;