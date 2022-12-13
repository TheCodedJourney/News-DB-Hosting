const {selectTopicPath} = require('../models/models.topics')


const getTopicPath = (request, response, next) => {
  selectTopicPath()
      .then((topics) => {
        response.status(200).send({ topics });
      })
      .catch((error) => {
        next(error);
      });
  };

module.exports = {getTopicPath}