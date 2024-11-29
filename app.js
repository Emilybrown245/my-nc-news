const express = require("express");
const { getApi, getTopics } = require("./controllers/app.controller");
const { handle404s, handlePsqlErrors, handleCustomErrors } = require("./errors");
const articlesRouter = require("./routes/articlesRouter");
const commentsRouter = require("./routes/commentsRouter");
const usersRouter = require("./routes/usersRouter");

const app = express()

app.use(express.json())

//Get requests
app.get('/api', getApi);
app.get('/api/topics', getTopics);

app.use('/api/articles', articlesRouter);
app.use('/api', commentsRouter);
app.use('/api/users', usersRouter);

//Errors
app.all("*", handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;