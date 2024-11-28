const endpointsJson = require("../endpoints.json");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const jestSorted = require("jest-sorted");

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
  test("400: Sends an appropriate status and error message when given an invalid id", () => {
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
 test("200: The articles should be sorted by date in descending order by default", () => {
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
 test("200: Responds with articles sorted by created_at in ascending order when specified", () => {
  return request(app)
  .get('/api/articles?order=asc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('created_at', {ascending: true});
  })
 })
 test("200: Responds with articles sorted by created_at in descending order when specified", () => {
  return request(app)
  .get('/api/articles?order=desc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('created_at', {descending: true});
  })
 })
 test("200: Responds with articles sorted by votes in ascending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=votes&order=asc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('votes', {ascending: true});
  })
 })
 test("200: Responds with articles sorted by votes in descending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=votes&order=asc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('votes', {ascending: true});
  })
 })
 test("200: Responds with articles sorted by author in ascending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=author&order=asc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('author', {ascending: true});
  })
 })
 test("200: Responds with articles sorted by author in descending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=author&order=desc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('author', {descending: true});
  })
 })
 test("200: Responds with articles sorted by title in ascending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=title&order=asc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('title', {ascending: true});
  })
 })
 test("200: Responds with articles sorted by title in descending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=title&order=desc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('title', {descending: true});
  })
 })
 test("200: Responds with articles sorted by article_id in ascending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=article_id&order=asc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('article_id', {ascending: true});
  })
 })
 test("200: Responds with articles sorted by article_id in descending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=article_id&order=desc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('article_id', {descending: true});
  })
 })
 test("200: Responds with articles sorted by comment_count in ascending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=comment_count&order=asc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('comment_count', {ascending: true});
  })
 })
 test("200: Responds with articles sorted by comment_count in descending order when specified", () => {
  return request(app)
  .get('/api/articles?sort_by=comment_count&order=desc')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(13);
    expect(articles).toBeSortedBy('comment_count', {descending: true});
  })
})
test("200: Responds with articles filtered by the topic query when specified", () => {
  return request(app)
  .get('/api/articles?topic=mitch')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(12);
    articles.forEach((articles) => {
      expect(articles.topic).toBe('mitch');
    })
  })
})
test("200: Responds with an empty array when filtering by a topic with no articles", () => {
  return request(app)
  .get('/api/articles?topic=paper')
  .expect(200).then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(0);
    expect(body.articles).toEqual([])
  })
})
 test("400: Sends an appropriate status and error message when given an invalid sort_by query", () => {
  return request(app)
    .get('/api/articles?sort_by=body')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid sort query');
    });
});
test("400: Sends an appropriate status and error message when given an invalid order query", () => {
  return request(app)
    .get('/api/articles?order=hello')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid order query');
    });
});
test("400: Sends an appropriate status and error message when given an invalid topic query", () => {
  return request(app)
    .get('/api/articles?topic=hi')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid topic query');
    });
});
test("400: Should respond with appropriate error messages in order when given multiple invalid queries", () => {
  return request(app)
    .get('/api/articles?sort_by=body&order=hello&topic=hi')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid sort query');
    });
});
test("400: Should respond with appropriate error messages in order when given multiple invalid queries", () => {
  return request(app)
    .get('/api/articles?sort_by=created_at&order=hello&topic=hi')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid order query');
    });
});
 test("404: Sends an appropriate status and error message when given an non-existent route", () => {
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
  test("400: Sends an appropriate status and error message when given an invalid id", () => {
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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Should add comment to an article when given article_id and the user is already defined in users.js", () => {
    const comment = {
      username: "rogersop",
      body: "This is a bad article name"
    }
    return request(app)
    .post("/api/articles/2/comments")
    .expect(201)
    .send(comment)
    .then(({ body }) => {
      const { comment } = body;
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: "rogersop",
        body: "This is a bad article name",
        article_id: 2
      })
    })
  })
  test("400: Sends appropriate status and error message when no username and/or body is given", () => {
    const invalidComment = {
      username: "rogersop"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .expect(400)
    .send(invalidComment)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    })
  })
  test("400: Sends an appropriate status and error message when given an invalid id", () => {
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
  test("404: Should respond with error message when the username doesn't exist in the users table", () => {
    const comment = {
      username: "user123",
      body: "This is a bad article name"
    }
    return request(app)
    .post("/api/articles/2/comments")
    .expect(404)
    .send(comment)
    .then(({ body }) => {
      expect(body.msg).toBe("User Doesn't Exist")
    })
  })
})
describe("PATCH /api/articles/:article_id", () => {
  test("200: Should update article to inclued votes", () => {
    const updatedVotes = {
      inc_votes: 12
    }
    return request(app)
    .patch("/api/articles/4")
    .expect(200)
    .send(updatedVotes)
    .then(({ body }) => {
      const { article } = body;
      expect(article).toMatchObject({
          article_id: 4,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 12,
          article_img_url: expect.any(String),
      })
    })
  })
  test("200: Should increment an article's votes when value is already defined", () => {
    const updatedVotes = {
      inc_votes: 50
    }
    return request(app)
    .patch("/api/articles/1")
    .send(updatedVotes)
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 150,
          article_img_url: expect.any(String),
      })
    })
  })
  test("200: Should decrement an article's votes when value is already defined", () => {
    const updatedVotes = {
      inc_votes: -50
    }
    return request(app)
    .patch("/api/articles/1")
    .send(updatedVotes)
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 50,
          article_img_url: expect.any(String),
      })
    })
  })
  test("400: Should respond with error message if inc_votes is not given", () => {
    const invalidVotes = {};
    return request(app)
    .patch("/api/articles/2")
    .send(invalidVotes)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("400: Should respond with error message if inc_votes is not given a number", () => {
    const invalidVotes = {
      inc_votes: "hi"
    }
    return request(app)
    .patch("/api/articles/2")
    .send(invalidVotes)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("400: Sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .patch('/api/articles/not-an-article-id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
})
test("404: Responds with error message if article does not exist", () => {
  return request(app)
  .patch("/api/articles/2000")
  .expect(404)
  .then(({ body }) => {
    expect(body.msg).toBe("Article Doesn't Exist")
  })
})
})
describe("DELETE /api/comments/:comments_id", () => {
  test("204: Should delete the comment with the given ID", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(() => {
      return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [1]).then(({ rows }) => {
        expect(rows.length).toBe(0)
      })
    })
  })
  test("200: Should return a message when the comment has been successfully deleted", () => {
    return request(app)
    .delete("/api/comments/2?return_message=true")
    .expect(200)
    .then(({ body }) => {
      expect(body.msg).toBe("Comment successfully deleted")
    })
  })
  test("400: Sends an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
      .delete('/api/comments/not-a-comment-id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
})
  test("404: Should respond with appropriate error message if the comment does not exist", () => {
    return request(app)
    .delete('/api/comments/80500')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Comment Not Found")
    })
  })
})
describe("GET /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({ body }) => {
      const { users } = body;
      expect(users).toHaveLength(4)
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  })
  test("404: Responds with a 'Route Not Found' for invalid input", () => {
    return request(app)
      .get("/api/uer")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Not Found") 
      })
    });
})
