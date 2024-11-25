const endpointsJson = require("../endpoints.json");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String)
          })
        })
      });
  });

  test("404: Responds with a 'Route Not Found' for invalid input", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Not Found") 
      })
    });
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an individual article", () => {
    return request(app)
    .get("/api/articles/2")
    .expect(200)
    .then(({ body }) => {
      expect(body.article).toMatchObject({
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: expect.any(String),
        created_at: expect.any(String),
        article_img_url: expect.any(String)
      })
    })
  })
  test("404: Responds with 'Article Doesn't Exist' for article id that is valid but does not exist", () => {
    return request(app)
    .get("/api/articles/2000")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article Doesn't Exist");
    })
  })
  test.only("400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get('/api/articles/not-an-article-id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
})