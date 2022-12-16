const psqlError = (error, request, response, next) => {
    if (error.code === "22P02"|| error.code === "23502" || error.code === "42703") response.status(400).send({ msg: "Bad Request" });
    else if( error.code === "23503") response.status(404).send({ msg: "Not Found" })
    else next(error);
  };

const error400 = (error, request, response, next) => {
    if(error.code === "22P02" ){
        response.status(400).send({msg: "Bad Request"})
    } else if (error.msg && error.status ){
        response.status(error.status).send({msg: error.msg})
    } else {
        next(error)
    }
}

const error404 = (request, response, next)=> {
    response.status(404).send({msg: "404 Not Found"})
}

const error500 = (error, request, response, next) => {
    console.log(error) // This is a constant error reference
    response
      .status(500)
      .send({ msg: "500 Internal Server Error" });
  };

module.exports = {error400, error404, error500, psqlError}
