# Northcoders News API

## We're Live 🎉 

https://news-db-hosting.onrender.com/

## Background

The purpose of this API is to provide access to news with programmatic databse url endpoints

A short summary of features from this API  to achieve the following: 
- Sort through articles based on topics, article id's, comments and the author
- View specific comments on articles 
- View a live updated comment count 
- Added and delete comments from the database

Any feedback is appreciated in these exciting early stages of this platform! 🚀

## Setup Guide 
---
### Requirements

`Node 19.0`

`Postgresql 14.0`


### 1. Clone this repository 
In your terminal, use the following command to clone this repository 
```
git clone https://github.com/TheCodedJourney/News-DB-Hosting
```
### 2. Install dependencies
In the terminal:
```
npm install 
```
### 3. Create environments

You will need to create and modify two .env files for your project, steps below: 

1. `.env.test`
   - In the `.env.test` file you have just created, paste the following code into the file  `PGDATABASE=nc_news_test` 
2. `.env.development`
    - In the `.env.development` file you have just created, paste the following code into the file  `PGDATABASE=nc_news` 

### 4. Set up databases 
In the terminal:
```
npm run seed
```

### 5. Run tests and check we're passing all tests ✅ 
In the terminal:
```
npm test
```

Once you have completed these steps, congrats you're all set 🎉 lets check out the API's list to see whats available
## The API's list

---
### **API Usage**
- Get a list with all the available endpoints GET /api

### **GET /api/topics**
- Get a list with topics + description

### **GET /api/articles**
- Get a list of all the articles (title, author, date when the article was created, topic, the content of the article, votes and the current comment count)

### **GET /api/articles**
- Serves an array of all topics

### **GET /api/articles/:article_id**
- Serves an array with the corresponding article

### **PATCH /api/articles/:article_id**
- Updates the comment count for an article and serves an article with an updated comment count
### **GET /api/articles/:article_id/comments**
- Serves an array of all the comments for a specific article

### **POST /api/articles/:article_id/comments**
- creates a new comment to an article and returns the comment just added in an array

### **DELETE /api/comments/:comment_id**
- Deletes a specific comment if it exists


## Feedback & Improvements 
---
I am a software developer looking to improve my skills at every turn 📈 Please if you have any feedback no matter how big or small, please contact me via one of my socials available on my github profile. 

If you like what you have seen or equally if you dislike what you see here I would love to connect to find out more about you and discuss ways in which I can improve this project further 🚀