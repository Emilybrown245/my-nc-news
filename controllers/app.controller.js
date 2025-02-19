const endpointsJson = require("../endpoints.json");
const { readTopics, fetchArticleById, selectArticles, selectCommentsByArticleId, addComment, checkUserExists, updateVotes, selectCommentAndDelete, selectUsers, updateCommentVotes, addArticle} = require("../models/app.model");

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

    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
}

exports.getArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query;
    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles});
        console.log(req.query, "<--query");
    })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then(() => {
        return selectCommentsByArticleId(article_id);
    }).then((comments) => {
            res.status(200).send({comments})
    })
    .catch(next);
}

exports.postCommentToArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    
    Promise.all([checkUserExists(username), fetchArticleById(article_id)]).then(() => {
        return addComment(article_id, username, body);
    }).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next);
}

exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    Promise.all([fetchArticleById (article_id)]).then(() => {
        return updateVotes(article_id, inc_votes);
    })
   .then((updatedArticle) => {
        res.status(200).send({ article: updatedArticle })
    })
    .catch(next);
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const { return_message } = req.query;
    if(return_message){
        return res.status(200).send({msg: "Comment successfully deleted"})
    }
    selectCommentAndDelete(comment_id).then(() => {
        res.status(204).send();
    })
    .catch(next);
}

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    })
    .catch(next);
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    checkUserExists(username).then((user) => {
        res.status(200).send({user});
    })
    .catch(next);
}

exports.patchCommentsVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_vote } = req.body;
    updateCommentVotes(comment_id, inc_vote).then((updatedComment) => {
        res.status(200).send({comment: updatedComment})
    })
    .catch(next);
}

exports.postArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url  } = req.body;
    const newArticle = { author, title, body, topic, article_img_url };

   addArticle(newArticle).then((article) => {
    res.status(201).send({ article })
   })
    .catch(next);
}