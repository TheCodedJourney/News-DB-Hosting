const express = require("express")

const {getTopicPath} = require('./controllers/controllers.topic')
const {getArticlePath, getArticleById} = require('./controllers/controllers.articles')
const {error400, error404, error500} = require('./controllers/controllers.errors')

const app = express()

app.get("/api/topics", getTopicPath);
app.get("/api/articles", getArticlePath)
app.get("/api/articles/:article_id", getArticleById)
app.all("*", error404);

app.use(error400)
app.use(error500)

module.exports = app