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

exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  const validSortByColumns = ['created_at', 'votes', 'author', 'title', 'article_id', 'comment_count'];
  const validTopics = ['mitch', 'cats', 'paper'];

  if(!validSortByColumns.includes(sort_by)){
    return Promise.reject({status: 400, msg: "Invalid sort query"})
  }

  if(order !== 'asc' && order !== 'desc'){
    return Promise.reject({status: 400, msg: "Invalid order query"});
  }

  if(topic && !validTopics.includes(topic)){
    return Promise.reject({status: 400, msg: "Invalid topic query"})
  }

  let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`
  const queryParams = [];

    if(validTopics.includes(topic)){
      queryString += ` WHERE articles.topic = $1`;
      queryParams.push(topic);
    }
    
    queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

    return db.query(queryString, queryParams).then(({rows}) => {
      return rows;
  })
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

exports.updateVotes = (article_id, inc_votes) => {
  return db.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *`, [article_id, inc_votes]).then(({ rows }) => {
    return rows[0];
  })
}

exports.selectCommentAndDelete = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id]).then(({ rows }) => {
    if(rows.length === 0){
      return Promise.reject({status: 404, msg: "Comment Not Found"});
    }
    return rows[0];
  })
}

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  })
}

