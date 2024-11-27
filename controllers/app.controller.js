const endpointsJson = require("../endpoints.json");
const { readTopics, fetchArticleById, selectArticles, checkArticleExist, selectCommentsByArticleId, addComment, checkUserExists} = require("../models/app.model");

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

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles});
    })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    checkArticleExist(article_id).then(() => {
        return selectCommentsByArticleId(article_id);
    }).then((comments) => {
            res.status(200).send({comments})
    })
    .catch(next);
}

exports.postCommentToArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    
    if(!username || !body){
        return res.status(400).send({msg: "Bad request: missing username or body"});
    }
    Promise.all([checkUserExists(username), checkArticleExist]).then(() => {
        return addComment(article_id, username, body);
    }).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}


