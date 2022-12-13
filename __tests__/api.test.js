const request = require('supertest')

const app = require('../app')
const db = require('../db/connection')
const testData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed') 

afterAll(() => db.end)
beforeEach(() => seed(testData))

describe('API testing', () => {
    describe('GET Requests', () => {
        test('200 - Should return correct values within the topics API. Format should be an array of objects for slug and description properties', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
                expect(topics).toBeInstanceOf(Array);
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
        // test('GET /api/description', () => {

        //     expect().toEqual();
        // });
    })
});