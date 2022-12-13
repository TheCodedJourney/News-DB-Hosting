const {selectArticleWithCommentCount} = require('../models/models.articles')


const getArticlePath = (request, response, next) => {
  selectArticleWithCommentCount()
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch(next)
  }

module.exports = {getArticlePath}