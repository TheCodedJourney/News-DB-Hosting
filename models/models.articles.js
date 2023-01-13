const db = require("../db/connection");
const moment = require("moment");

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

const selectByArticleID = (articleId) => {
  const queryString = `
  SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;
  `;
  return db.query(queryString, [articleId]).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 404, msg: "404 Not Found" });
    return rows[0];
  });
};

const commentsByArticleId = (article_id) => {
  const query = `SELECT * FROM comments
  WHERE article_id = $1 ORDER BY created_at DESC;`;
  return db.query(query, [article_id]).then((result) => {
    return result.rows;
  });
};

const addComment = (article_id, newComment) => {
  const { username, body } = newComment
  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
      [body, article_id, username]
    )
    .then(({ rows }) => rows[0]);
};

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
};

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

const checkCommentExistence = (comment_id) => {
  const query = `SELECT * FROM comments WHERE comment_id = $1`;
  return db.query(query, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return result.rows;
    })
    .catch((error) => {
      return Promise.reject({ status: 404, msg: "Not Found", error });
    });
};


const deleteCommentByIdSelection = (comment_id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
  return db.query(query, [comment_id])
  .then((result) => {
    if(result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
    }
    return result.rows;
  })
  .catch((error) => {
    return Promise.reject({ status: 404, msg: "Not Found" });
  });
};

module.exports = {
  selectArticles,
  selectByArticleID,
  commentsByArticleId,
  addComment,
  updateArticleVotes,
  checkItemExistence,
  checkCommentExistence,
  deleteCommentByIdSelection,
};
