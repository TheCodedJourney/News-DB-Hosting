const comments = require('../db/data/test-data/comments');
const {selectArticles, selectByArticleID, commentsByArticleId} = require('../models/models.articles')


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
    commentsByArticleId(article_id)
      .then((comments) => {
        console.log(comments)
        if (comments.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `404 Not Found`,
          });
        }
        response.status(200).send({ comments });
      })
      .catch((error)=>{
        next(error)
      })
    }
  


module.exports = {getArticlePath, getArticleById, getCommentsByArticleId}