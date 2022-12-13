const express = require("express")

const {getTopicPath} = require('./controllers/controllers.topic')
const {error404} = require('./controllers/controllers.errors')

const app = express()
app.use(express.json());
app.get("/api/topics", getTopicPath);
app.all("*", error404);

module.exports = app