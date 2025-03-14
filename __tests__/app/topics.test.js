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
  test("201: Accepts an optional property of img_url", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "weather",
        description: "all about the weather",
        img_url: "some_url",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "weather",
          description: "all about the weather",
          img_url: "some_url",
        });
      });
  });
  test("400: Responds with 'Bad Request' if the request body does not contain all the information", () => {
    return request(app)
      .post("/api/topics")
      .send({ description: "all about the weather" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incomplete data provided: missing slug");
      });
  });
  test("400: Responds with 'Bad Request' if a topic with the same slug already exists", () => {
    return request(app)
      .post("/api/topics")
      .send({ slug: "cats", description: "all about the weather" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("400: Responds with 'Bad Request' if the data provided violates database constraints", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "weather",
        description: "all about the weather",
        img_url:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam qu",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});
