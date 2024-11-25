const db = require("../db/connection");

exports.readTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
      return rows;
    })
  }

  exports.fetchArticleById = (article_id) =>{
    if(isNaN(parseInt(article_id))){
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
    if(rows.length === 0){
      return Promise.reject({code: "INVALID_ID", msg: "Article Doesn't Exist"})
    }
    return rows[0];
  })
}