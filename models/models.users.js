const db = require('../db/connection');

const selectAllUsers = () => {
  const queryString = `SELECT * FROM users;`
    return db.query(queryString).then(({rows}) => {return rows})
}

module.exports = {selectAllUsers}