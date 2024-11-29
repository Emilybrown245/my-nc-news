const express = require("express");
const { getCommentsByArticleId, postCommentToArticle, deleteCommentById, patchCommentsVotes} = require("../controllers/app.controller");

const commentsRouter = express.Router();

commentsRouter.get('/articles/:article_id/comments', getCommentsByArticleId);
commentsRouter.post('/articles/:article_id/comments', postCommentToArticle);
commentsRouter.delete('/comments/:comment_id', deleteCommentById);
commentsRouter.patch('/comments/:comment_id', patchCommentsVotes);

module.exports = commentsRouter;