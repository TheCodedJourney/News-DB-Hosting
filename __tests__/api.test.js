const request = require('supertest')

const app = require('../app')
const db = require('../db/connection')
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed') 

afterAll(() => db.end())
beforeEach(() => seed(testData))

describe('API testing', () => {
    describe('GET Requests topics', () => {
        test('200 - Should return correct values within the topics API. Format should be an array of objects for slug and description properties', () => {
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
        test('404 - It should return an error when the wrong path is provided', () => {
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
            console.log(body)
                expect(articles).toHaveLength(12)
                articles.forEach((article) => {
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number),
                    })
                })
            })
        })
    })
});