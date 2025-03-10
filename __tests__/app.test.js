const app = require("../app");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");

/* Set up your beforeEach & afterAll functions here */

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
