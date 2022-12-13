const {selectArticles, selectByArticleID} = require('../models/models.articles')


const getArticlePath = (request, response, next) => {
  selectArticles()
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch(next)
  }
const getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    selectByArticleID(article_id)
      .then((articles) => {
          response.status(200).send({ articles });
      })
      .catch((error)=>{
        next(error)
      })
  };
module.exports = {getArticlePath, getArticleById}