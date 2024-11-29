const express = require("express");
const { getApi, getTopics, getUsers} = require("./controllers/app.controller");
const { handle404s, handlePsqlErrors, handleCustomErrors } = require("./errors");
const articlesRouter = require("./routes/articlesRouter");
const commentsRouter = require("./routes/commentsRouter");

const app = express()

app.use(express.json())

app.use('/api/articles', articlesRouter);
app.use('/api', commentsRouter);

//Get requests
app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/users', getUsers);

//Errors
app.all("*", handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;