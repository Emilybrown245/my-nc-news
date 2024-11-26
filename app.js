const express = require("express");
const { getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId, postCommentToArticle, patchArticleVotes, deleteCommentById, getUsers} = require("./controllers/app.controller");
const { handle404s, handlePsqlErrors, handleCustomErrors } = require("./errors");

const app = express()

app.use(express.json())

//Get requests
app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentToArticle);
app.patch('/api/articles/:article_id', patchArticleVotes);
app.delete('/api/comments/:comment_id', deleteCommentById);
app.get('/api/users', getUsers);

//Errors
app.all("*", handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;