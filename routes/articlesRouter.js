const express = require("express")
const { getArticleById, getArticles, patchArticleVotes } = require("../controllers/app.controller");

const articlesRouter = express.Router();

articlesRouter.get('/:article_id', getArticleById);
articlesRouter.get('/', getArticles);
articlesRouter.patch('/:article_id', patchArticleVotes);

module.exports = articlesRouter;