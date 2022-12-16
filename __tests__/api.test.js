const request = require('supertest')

const app = require('../app')
const db = require('../db/connection')
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed') 

afterAll(() => db.end())
beforeEach(() => seed(testData))

describe('API testing', () => {
    describe('GET Requests topics', () => {
        test('2, Should return correct values within the topics API. Format should be an array of objects for slug and description properties', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
                expect(topics).toHaveLength(3);
                topics.forEach((topic)=>{
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )
                })
        })  
    });
        test('404, It should return an error when the wrong path is provided', () => {
            return request(app)
            .get('/api/topical')
            .expect(404)
            .then(({body : {msg}}) => {
             expect(msg).toBe("404 Not Found")   
            })
        });
    })
    describe('GET /api/articles', () => {
        test('should return array of article objects including a comment_count property ', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body})=> {
            const {articles} = body
                expect(articles).toHaveLength(12)
                articles.forEach((article) => {
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                })
            })
        })
        
          
        test("200 It should should return article objects in date descending order", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy("created_at", {descending: true });
              });
            });
    })
    describe("GET /api/articles/:article_id", () => {
        test("should return an array of an article objects that matches the passed article_id", () => {
        const articleRequest = 4 
          const articleObject = {
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: "2020-05-06T01:14:00.000Z",
            title: "Student SUES Mitch!",
            topic: "mitch",
          }
          
          return request(app)
            .get("/api/articles/4")
            .expect(200)
            .then(({ body }) => {
              const { article } = body;
              expect(article).toMatchObject(articleObject);
              expect(article.article_id).toEqual(articleRequest)
              
            });
        });
        test("200 - Must obtain the correct values of comment_count from test data ", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                const commentCount = articles.map((article) => {
                  return article.comment_count;
                });
                expect(commentCount).toEqual([
                  2, 1, 0, 0, 2, 11, 2, 0, 0, 0, 0, 0,
                ]);
              });
          });

        test('404, responds with an error message when passed an article ID that does not exist', () => {
          return request(app)
            .get('/api/articles/500')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('404 Not Found');
            });
        });
        test('400, responds with an error message when passed an article ID that doesnt fit the entry requirements', () => {
          return request(app)
            .get('/api/articles/thisisnotvalidfriend')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
    });
    describe("GET /api/articles/:article_id/comments", () => {
        test("200 returns an array of category objects", () => {
            return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toHaveLength(2)
                comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                    body: expect.any(String),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    comment_id: expect.any(Number),
                    })
                );
                });
            });
        });
        test('200 - should return an empty array when passed no comments', () => {
            return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toHaveLength(0)
                expect(comments).toEqual([])
            });
            });
        test("200 It should should return comments objects in date descending order", () => {
            return request(app)
                .get("/api/articles/2/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", {descending: true });
                });
            });
      

        test("404 - responds with an error message when passed an article ID that does not exist", () => {
            return request(app)
            .get("/api/articles/22842/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("404 Not Found");
            });
        });

        test("400 - responds with an error message when passed a bad article ID", () => {
            return request(app)
            .get("/api/articles/thisisinvalidmyfriend/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
        });
    });
  
    describe('POST Request article/:id/comments', () => {
        test("404 - responds with an error message when passed a user that does not exist", () => {
            const newComment = {
              username: "commentMaster",
              body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
            };
            return request(app)
              .post("/api/articles/6/comments")
              .send(newComment)
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
              });
          });
          test("404 - responds with an error message when passed no user", () => {
            const newComment = {
              username: "",
              body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
            };
            return request(app)
              .post("/api/articles/6/comments")
              .send(newComment)
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
              });
            });
        });


        describe('PATCH /api/articles/:article_id', () => {
            test('200 - should incremement article votes by correct number and return new total', () => {
                const newVote = {inc_votes: 1}
                return request(app)
                .patch('/api/articles/1')
                .send(newVote)
                .expect(200)
                .then(({ body: { article } })=>{
                    expect(article).toMatchObject({
                        body: "I find this existence challenging",
                        votes: 101,
                        author: "butter_bridge",
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        created_at: "2020-07-09T20:11:00.000Z",
                        topic: "mitch"
                    });
                });
                
            });

            test('200 - should decrement article votes by correct number and return new total', () => {
                const newVote = {inc_votes: -1}
                return request(app)
                .patch('/api/articles/1')
                .send(newVote)
                .expect(200)
                .then(({ body: { article } })=>{
                    expect(article).toMatchObject({
                        body: "I find this existence challenging",
                        votes: 99,
                        author: "butter_bridge",
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        created_at: "2020-07-09T20:11:00.000Z",
                        topic: "mitch"
                    })

                })
            });
            test('200 - votes should remain the same if no new votes added ', () => {
                const newVote = {inc_votes: 0}
                return request(app)
                .patch('/api/articles/1')
                .send(newVote)
                .expect(200)
                .then(({ body: { article } })=>{
                    expect(article).toMatchObject({
                        body: "I find this existence challenging",
                        votes: 100,
                        author: "butter_bridge",
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        created_at: "2020-07-09T20:11:00.000Z",
                        topic: "mitch"
                    })
                });
            });
            test('404 - when article id does not exist', () => {
                const newVote = {inc_votes: 1}
                return request(app)
                .patch('/api/articles/910283')
                .send(newVote)
                .expect(404)
                .then(({ body: { msg } })=>{
                    expect(msg).toBe("404 Not Found")
                })
            });
            
            test('400 - Bad Request when wrong data type entered', () => {
                const newVote = { voteCount: "1BillionDollars" };
                        return request(app)
                    .patch("/api/articles/12")
                    .send(newVote)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad Request");
                });
            });
            test('400 - Bad Request when wrong key is passed', () => {
                const newVote = { daveyJones: 1 };
                        return request(app)
                    .patch("/api/articles/12")
                    .send(newVote)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad Request");
                });
            });
            test('400 - Bad Request when newVote has no properties', () => {
                const newVote = {};
                        return request(app)
                    .patch("/api/articles/12")
                    .send(newVote)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad Request");
                });
            });
        });
    describe("GET /api/users", () => {
      test("200 - Should return an array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(4);
          });
      });
      test("200 - Should return an array of objects of users with correct properties", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            users.forEach((user) => {
              expect(user).toMatchObject(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            });
          });
      });
      test("404 - It should return an error when incorrect path is provided", () => {
        return request(app)
          .get("/api/userz")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("404 Not Found");
          });
      });

    });
    describe('GET /api/articles (queries)', () => {
        test("200 - It should should return the articles sorted by any valid column (alphabetically or ascending)", () => {
            return request(app)
              .get("/api/articles?sort_by=author")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy("author");
              });
          });
          test("200 - It should should return the articles based on the topic provided", () => {
            return request(app)
              .get("/api/articles?topic=mitch")
              .expect(200)
              .then(({ body: { articles } }) => {
                articles.forEach((article) => {
                  expect(article.topic).toEqual("mitch");
                });
              });
          });
          test("200 - It should should return the articles in ascending order when order query = ASC (not sensitive to lower or uppercase)", () => {
            return request(app)
              .get("/api/articles?order=ASC")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy("created_at");
              });
          });
          test("400 - sent an invalid column to sort by", () => {
            return request(app)
              .get("/api/articles?order=asc; DROPTABLES")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request");
              });
          });
          test("404 - sent a topic that does not exist", () => {
            return request(app)
              .get("/api/articles?topic=jake; DROPTABLES")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("404 Not Found");
              });
          });
          test("400 - sent an invalid order", () => {
            return request(app)
              .get("/api/articles?order=asc; DROPTABLES")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request");
              });            
        });
    });
    describe("DELETE /api/comments/:comment_id", () => {
      test("400 - wrong Id Type", () => {
        return request(app)
          .delete("/api/comments/three")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("404 - comment does not exist", () => {
        return request(app)
          .delete("/api/comments/300")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found")

          });
        });
    });
});