const express = require("express")

const {getTopicPath} = require('./controllers/controllers.topic')
const {postComment, getArticlePath, getArticleById, getCommentsByArticleId, patchArticleVotes, deleteComment, jsonInfo} = require('./controllers/controllers.articles')
const {psqlError, error400, error404, error500} = require('./controllers/controllers.errors')
const {getUsers} = require('./controllers/controllers.users')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get("/api", jsonInfo)
app.get("/api/topics", getTopicPath);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticlePath);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", error404);
app.use(psqlError)
app.use(error400)
app.use(error500)

module.exports = app