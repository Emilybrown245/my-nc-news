const express = require("express");
const { getCommentsByArticleId, postCommentToArticle, deleteCommentById} = require("../controllers/app.controller");

const commentsRouter = express.Router();

commentsRouter.get('/articles/:article_id/comments', getCommentsByArticleId);
commentsRouter.post('/articles/:article_id/comments', postCommentToArticle);
commentsRouter.delete('/comments/:comment_id', deleteCommentById);

module.exports = commentsRouter;