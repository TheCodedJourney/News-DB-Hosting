const db = require('../db/connection')


const selectArticles = () => {
    const query = `
    SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`
    return db.query(query).then((result) =>{return result.rows })
}
const selectByArticleID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result)=> {
      if(result.rowCount === 0){ 
        return Promise.reject({status: 404, msg:"404 Not Found"})
      }else {
        return result.rows[0]
      }})

    .catch((error) =>{
      return Promise.reject(error)
    })
};

const commentsByArticleId = (article_id) => {
  const query = `SELECT * FROM comments
  WHERE article_id = $1 ORDER BY created_at DESC;`;
  return db.query(query, [article_id]).then((result) => result.rows);
};


addComment = (article_id, newComment) => {
  
    const { username, body } = newComment
    return db
      .query(
        "INSERT INTO comments (body, votes, article_id, created_at, author) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [body, 0, article_id, new Date(), username]
      )
      .then(({ rows }) => rows[0])
}

module.exports = {selectArticles, selectByArticleID, commentsByArticleId, addComment}