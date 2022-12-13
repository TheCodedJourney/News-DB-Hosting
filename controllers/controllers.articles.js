const {selectArticlePath} = require('../models/models.articles')


const getArticlePath = (request, response, next) => {
  selectArticlePath()
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch(next)
  }

module.exports = {getArticlePath}