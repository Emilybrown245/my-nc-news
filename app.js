const express = require("express");
const { getApi, getTopics } = require("./controllers/app.controller");
const { handle404s, handlePsqlErrors, handleCustomErrors } = require("./errors");
const articlesRouter = require("./routes/articlesRouter");
const commentsRouter = require("./routes/commentsRouter");
const usersRouter = require("./routes/usersRouter");
const cors = require('cors');

const app = express()
app.use(cors());

app.use(express.json())

app.get('/api', getApi);
app.get('/api/topics', getTopics);

app.use('/api/articles', articlesRouter);
app.use('/api', commentsRouter);
app.use('/api/users', usersRouter);
 
app.all("*", handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;