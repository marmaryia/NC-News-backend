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
});

describe("GET /aqi", () => {
  test("404: Responds with a message about the endpoint not existing", () => {
    return request(app)
      .get("/aqi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This endpoint does not exist.");
      });
  });
});
