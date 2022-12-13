const error404 = (request, response, next)=> {
    response.status(404).send({msg: "404 Not Found"})
}

module.exports = {error404}
