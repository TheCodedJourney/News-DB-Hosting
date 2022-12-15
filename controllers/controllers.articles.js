const {selectArticles, selectByArticleID, commentsByArticleId, addComment, updateArticleVotes, selectUsers} = require('../models/models.articles')


const getArticlePath = (request, response, next) => {
  selectArticles()
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch(next)
  }

const getArticleById = (request, response, next) => {
    const { article_id} = request.params;
    selectByArticleID(article_id)
      .then((articles) => {
          response.status(200).send({ articles });
      })
      .catch((error)=>{
        next(error)
      })
  };


const getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectByArticleID(article_id).then(() => { return commentsByArticleId(article_id) })
      .then((comments) => {
        response.status(200).send({ comments });
      })
      .catch((error)=>{
        next(error)
      })
    }

const postComment = (request, response, next) => {
      const { article_id } = request.params;
      addComment(article_id, request.body)
        .then((comment) => {
          res.status(201).send({ comment });
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

module.exports = {getArticlePath, getArticleById, getCommentsByArticleId, postComment, patchArticleVotes}