const { app, request, seed, data, db } = require("./index");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: Responds with an array containing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("POST /api/topics", () => {
  test("201: Responds with an object representing the added topic", () => {
    return request(app)
      .post("/api/topics")
      .send({ slug: "weather", description: "all about the weather" })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "weather",
          description: "all about the weather",
        });
      });
  });
  test("400: Responds with 'Bad Request' if the request body does not contain all the information", () => {
    return request(app)
      .post("/api/topics")
      .send({ description: "all about the weather" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request: Incomplete data provided");
      });
  });
  test("400: Responds with 'Bad Request' if an article with the same slug already exists", () => {
    return request(app)
      .post("/api/topics")
      .send({ slug: "cats", description: "all about the weather" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request: Check in input values");
      });
  });
});
