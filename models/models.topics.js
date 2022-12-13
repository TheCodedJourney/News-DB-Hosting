const db = require('../db/connection')


const selectTopicPath = () => {
    const topicQueryPath = `SELECT * FROM topics;`
    return db.query(topicQueryPath).then(({rows}) => {
        return rows
    })
}

module.exports = {selectTopicPath}