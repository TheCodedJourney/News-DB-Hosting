const db = require('../db/connection')


const selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortByQueries = [
    "author",
    "created_at",
    "title",
    "article_id",
    "topic",
    "votes",
    "comment_count",
  ];
  const validSortingOrder = ["asc", "desc"];

  if (!validSortingOrder.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let query = `
  SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const queryParam = [];
  if (topic !== undefined) {
    query += `WHERE topic = $1`;
    queryParam.push(topic);
  }

  if (sort_by !== "created_at") order = "ASC";

  query += `
  GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order};`;
  return db.query(query, queryParam).then(({ rows }) => {
    return rows;
  });
};

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


const addComment = (article_id, newComment) => {
    const { username, body } = newComment
    return db
      .query(
        "INSERT INTO comments (body, votes, article_id, created_at, author) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [body, 0, article_id, new Date(), username]
      )
      .then(({ rows }) => rows[0])
}

const updateArticleVotes = (article_id, newVote) => {
  const { inc_votes } = newVote;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

const checkItemExistence = (category, element) => {
  let query = `SELECT * FROM articles `;
  if (category === "topic") query += `WHERE topic = $1;`;
  else if (category === "article_id") query += `WHERE article_id = $1;`;

  return db.query(query, [element]).then((data) => {
    if (data.rowCount === 0) 
    return Promise.reject({ status: 404, msg: "404 Not Found" });
    else return true;
  });
};

module.exports = {selectArticles, selectByArticleID, commentsByArticleId, addComment, updateArticleVotes, checkItemExistence}