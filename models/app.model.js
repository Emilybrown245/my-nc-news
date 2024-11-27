const db = require("../db/connection");

exports.readTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
      return rows;
    })
  }

  exports.fetchArticleById = (article_id) =>{
    return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
    if(rows.length === 0){
      return Promise.reject({status: 404, msg: "Article Doesn't Exist"})
    }
    return rows[0];
  })
}

exports.selectArticles = () => {
  return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`).then(({rows}) => {
    return rows;
  })
}

exports.checkArticleExist = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
     return Promise.reject({ status: 404, msg: "Article Doesn't Exist" });
    }
    return rows[0]; 
  }
  )
}

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC`, [article_id]).then(({ rows }) => {
      if (rows.length === 0) {
        return [];
      }
      return rows;
    })
  }

exports.addComment = (article_id, username, body) => {
    return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`, [article_id, username, body]).then(({ rows }) => {
      return rows[0];
    })
   }

exports.checkUserExists = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [username]).then(({ rows }) => {
    if(!rows.length){
      return Promise.reject({status: 404, msg: "User Doesn't Exist"});
    }
    return rows;
  })
}
