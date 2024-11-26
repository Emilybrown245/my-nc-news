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
  test("400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get('/api/articles/not-an-article-id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
})
describe("GET /api/articles", () => {
  test("200: Responds with all article objects with the body property not included and a comment_count property added", () => {
     return request(app)
     .get("/api/articles")
     .expect(200)
     .then(({ body }) => {
      const { articles } = body;
      expect(articles).toHaveLength(13)
      articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
 test("200: The articles should be sorted by date in descending order", () => {
  return request(app)
  .get("/api/articles")
  .expect(200)
  .then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    const sortedArr = [...articles].sort((a, b) => b.created_at.localeCompare(a.created_at));
    expect(articles).toEqual(sortedArr);
  })
 })
 test("404: sends an appropriate status and error message when given an non-existent route", () => {
  return request(app)
    .get('/api/artles')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Route Not Found');
    });
});
})
describe("GET /api/articles/:article_id/comments ", () => {
  test("200: Responds with an array of comments for a given article_id", () => {
    return request(app)
    .get("/api/articles/9/comments")
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(comments).toHaveLength(2);
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 9
        })
      })
    })
  })
  test("200: Responds with comments sorted by created_at in descending order if there are multiple comments", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
    const { comments } = body;
    expect(comments).toHaveLength(11)
    const sortedArr = [...comments].sort((a, b) => b.created_at.localeCompare(a.created_at));
    expect(comments).toEqual(sortedArr);
    })
  })
  test("200: Responds with an empty array if the article exists but there are no comments", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments).toEqual([])
    })
  })
  test("400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get('/api/articles/not-an-article-id/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
test("404: Responds with error message if article does not exist", () => {
  return request(app)
  .get("/api/articles/9000/comments")
  .expect(404)
  .then(({ body }) => {
    expect(body.msg).toBe("Article Doesn't Exist")
  })
})
})
