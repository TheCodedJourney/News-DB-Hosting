const {selectArticles, selectByArticleID, commentsByArticleId, addComment, updateArticleVotes, checkItemExistence, articleQuery, deleteCommentByIdSelection} = require('../models/models.articles')
const endpoints = require("../endpoints.json");

const getArticlePath = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  const promises = [selectArticles(sort_by, order, topic)];
  if (topic !== undefined) promises.push(checkItemExistence("topic", topic));
  Promise.all(promises)
    .then((articles) => {
      response.status(200).send({ articles: articles[0] });
    })
    .catch((error) => next(error));
};

const getArticleById = (request, response, next) => {
    const { article_id} = request.params;
    selectByArticleID(article_id)
      .then((article) => {
          response.status(200).send({ article });
      })
      .catch((error)=>{
        next(error)
      })
  };

  const getCommentsByArticleId = (request, response, next) => {
    const articleId = request.params.article_id;
    const promises = [commentsByArticleId(articleId)];
    promises.push(checkItemExistence("article_id", articleId));
    Promise.all(promises)
      .then(([comments]) => response.status(200).send({ comments }))
      .catch((error) => next(error));
  };

const postComment = (request, response, next) => {
      const { article_id } = request.params;
      addComment(article_id, request.body)
        .then((comment) => {
          response.status(201).send({ comment });
        })
        .catch(next)
    }

const patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { body } = request;
  Promise.all([
    updateArticleVotes(article_id, body),
    selectByArticleID(article_id),
  ])
    .then(([article]) => {
      response.send({ article });
    })
    .catch(next);
};

const getArticleQuery = (request, response, next) => {
  const { topic, sort_by, order } = request.params
  articleQuery(sort_by, order, topic)
  .then((articles) => response.status(200).send({ articles }))
  .catch((error) => next(error));

}

const deleteComment = (request, response, next) => {
  const comment_id = request.params.comment_id;
  const promise = [deleteCommentByIdSelection(comment_id)];

  promise.push(checkItemExistence("comment_id", comment_id));
  Promise.all(promise)
    .then((deletedComment) => {
      console.log("im here")
      response.status(204).send({ deletedComment });
    })
    .catch((error) => next(error));
  }

  const jsonInfo = (request, response, next) => {
    response.status(200).send({ endpoints });
  };

module.exports = {getArticlePath, getArticleById, getCommentsByArticleId, postComment, patchArticleVotes, getArticleQuery, deleteComment, jsonInfo}

