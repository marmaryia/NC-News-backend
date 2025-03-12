const { app, request, seed, data, db } = require("./index");

beforeEach(() => seed(data));

afterAll(() => db.end());

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

describe("GET /api/users/:username", () => {
  test("200: Responds with the user with the requested username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "lurker",
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("404: Responds with 'Not Found' if a user with the requested username does not exist in the database", () => {
    return request(app)
      .get("/api/users/notauser")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("The item requested does not exist in the database");
      });
  });
});
