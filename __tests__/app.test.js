const app = require("../app");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
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
  test("200: Responds with an array containing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          const {
            article_id,
            title,
            topic,
            author,
            created_at,
            votes,
            article_img_url,
            comment_count,
          } = article;
          expect(typeof article_id).toBe("number");
          expect(typeof title).toBe("string");
          expect(typeof topic).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof created_at).toBe("string");
          expect(typeof votes).toBe("number");
          expect(typeof article_img_url).toBe("string");
          expect(typeof comment_count).toBe("number");
        });
      });
  });
  test("200: The articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("200: The comment_count property represents the number of comments for the article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0].comment_count).toBe(2);
      });
  });
  test("200: The article objects have no body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article at the requested article ID", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        const {
          article_id,
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        } = article;
        expect(article_id).toBe(3);
        expect(typeof title).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof author).toBe("string");
        expect(typeof body).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
      });
  });
  test("404: Responds with 'Not Found' if an article with the requested ID does not exist in the database", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("The item requested does not exist in the database");
      });
  });
  test("400: Responds with 'Bad Request' if the requested ID is not valid", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("202: Responds with an object representing the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(202)
      .then(({ body: { article } }) => {
        const {
          article_id,
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        } = article;
        expect(votes).toBe(99);
        expect(article_id).toBe(1);
        expect(typeof title).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof author).toBe("string");
        expect(typeof body).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof article_img_url).toBe("string");
      });
  });
  test("404: Responds with 'Not Found' if an article with the requested ID does not exist in the database", () => {
    return request(app)
      .patch("/api/articles/500")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("The item requested does not exist in the database");
      });
  });
  test("400: Responds with 'Bad Request' if the requested ID is not valid", () => {
    return request(app)
      .patch("/api/articles/notAnId")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: invalid input");
      });
  });
  test("400: Responds with 'Bad Request' if incomplete data provided", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: incomplete data provided");
      });
  });
  test("400: Responds with 'Bad Request' if the data provided is not valid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "notANumber" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: invalid input");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all comments for the article with the provided ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          const { comment_id, votes, created_at, author, body, article_id } =
            comment;
          expect(article_id).toBe(1);
          expect(typeof comment_id).toBe("number");
          expect(typeof votes).toBe("number");
          expect(typeof created_at).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof body).toBe("string");
        });
      });
  });
  test("200: The comments are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("200: Responds with an empty array when the article with the provided ID does exist in the database but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("404: Responds with 'Not Found' if the article with the provided ID does not exist in the database", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("The item requested does not exist in the database");
      });
  });
  test("400: Responds with 'Bad Request' if the provided ID is not valid", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object representing the added comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "lurker", body: "Fantastic!" })
      .expect(201)
      .then(({ body: { comment } }) => {
        const { comment_id, article_id, body, votes, author, created_at } =
          comment;
        expect(comment_id).toBe(19);
        expect(article_id).toBe(2);
        expect(body).toBe("Fantastic!");
        expect(votes).toBe(0);
        expect(author).toBe("lurker");
        expect(typeof created_at).toBe("string");
      });
  });
  test("400: Responds with 'Bad Request' if the provided ID is not valid", () => {
    return request(app)
      .post("/api/articles/notAnId/comments")
      .send({ username: "lurker", body: "Fantastic!" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: invalid input");
      });
  });
  test("404: Responds with 'Not Found' if the article with the provided ID does not exist in the database", () => {
    return request(app)
      .post("/api/articles/500/comments")
      .send({ username: "lurker", body: "Fantastic!" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this identifier.");
      });
  });
  test("400: Responds with 'Bad Request' if the comment body to add to the article is incomplete", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "Fantastic!" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request: Incomplete data provided");
      });
  });
  test("404: Responds with 'Not Found' if the foreign key in the comment body does not exist in the database", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: 5, body: "Fantastic!" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this identifier.");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: No content", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("400: Responds with 'Bad Request' if the provided ID is not valid", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: invalid input");
      });
  });
  test("404: Responds with 'Not Found' if no comment with the provided ID exists in the database", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this identifier.");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array containing all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /aqi", () => {
  test("404: Responds with a message about the endpoint not existing", () => {
    return request(app)
      .get("/aqi")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("This endpoint does not exist.");
      });
  });
});
