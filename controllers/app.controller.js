const endpointsJson = require("../endpoints.json");
const { readTopics, fetchArticleById, selectArticles} = require("../models/app.model");

exports.getApi = (req, res) => {
res.status(200).send({ endpoints: endpointsJson });
}

exports.getTopics = (req, res, next) =>{
    readTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article});
    })
    .catch(next);
}

exports.getArticles = (req, res) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles});
    });
}