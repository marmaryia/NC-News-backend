const { app, request, seed, data, db } = require("./index");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api/articles", () => {
  test("200: Responds with an array of 10 article objects as default if no limit specified", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
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
  test("200: The response includes the total_count property, representing the total number of results discounting the limit", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { total_count } }) => {
        expect(total_count).toBe(13);
      });
  });
  describe("?sort_by={column_name}", () => {
    test("200: The articles can be sorted by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "author", descending: true });
        });
    });
    test("400: Responds with 'Bad Request' if given an invalid column name", () => {
      return request(app)
        .get("/api/articles?sort_by=not_a_column")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
  });
  describe("?order={asc or desc}", () => {
    test("200: The articles can be sorted in ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({ key: "created_at" });
        });
    });
    test("400: Responds with 'Bad Request' if given an invalid order option", () => {
      return request(app)
        .get("/api/articles?order=not_valid_order")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid value");
        });
    });
  });
  describe("?topic={topic_name}", () => {
    test("200: Responds only with articles on the requested topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(1);
          expect(articles.length).toBe(1);
          articles.forEach((article) => {
            expect(article.topic).toBe("cats");
          });
        });
    });
    test("404: Responds with 'Not Found' if the requested topic is not present in the database", () => {
      return request(app)
        .get("/api/articles?topic=notATopic")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Nothing found with this value");
        });
    });
    test("200: Responds with an empty array if the requested topic exists but there are no articles about it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(0);
        });
    });
  });
  describe("?limit={number of responses}", () => {
    test("200: Responds with the number of responses specified by the limit", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(5);
        });
    });
    test("400: Responds with 'Bad Request' if the provided limit is not valid", () => {
      return request(app)
        .get("/api/articles?limit=five")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid value");
        });
    });
  });
  describe("?p={page at which to start}", () => {
    test("200: Responds with an array of objects offset by the requested number of pages", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(3);
        });
    });
    test("200: Responds with an empty array if the requested page is out of scope", () => {
      return request(app)
        .get("/api/articles?p=100")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(0);
        });
    });
    test("400: Responds with 'Bad Request' if the requested page is not valid", () => {
      return request(app)
        .get("/api/articles?p=one")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid value");
        });
    });
  });
  describe("?invalid_query={something}", () => {
    test("400: Responds with 'Bad Request' if the query is not supported", () => {
      return request(app)
        .get("/api/articles?some_query=notAValue")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request: the query is not supported");
        });
    });
  });
});

describe("POST /api/articles", () => {
  test("201: Responds with an object representing the newly added article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "lurker",
        title: "New Article",
        body: "New article text",
        topic: "cats",
        article_img_url: "some_url",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 14,
          title: "New Article",
          topic: "cats",
          author: "lurker",
          body: "New article text",
          created_at: expect.any(String),
          votes: 0,
          article_img_url: "some_url",
          comment_count: 0,
        });
      });
  });
  test("201: Accepts requests without article_img_url specified", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "lurker",
        title: "New Article",
        body: "New article text",
        topic: "cats",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_img_url).toBe(null);
      });
  });
  test("400: Responds with 'Bad Request' if the request body incomplete", () => {
    return request(app)
      .post("/api/articles")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incomplete data provided: missing author");
      });
  });
  test("404: Responds with 'Not Found' if a foreign key in the article body does not exist in the database", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "unknown author",
        title: "New Article",
        body: "New article text",
        topic: "cats",
        article_img_url: "some_url",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this identifier.");
      });
  });
  test("400: Responds with 'Bad Request' if the data provided violates database constraints", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "lurker",
        title: "New Article",
        body: "New article text",
        topic: "cats",
        article_img_url:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam qu",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article at the requested article ID", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("200: The comment_count property represents the number of comments for the article", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(2);
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
        expect(msg).toBe("Invalid value");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with an object representing the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          votes: 99,
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: Does not change other articles apart from the requested one", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(() => {
        return db.query(`SELECT votes FROM articles WHERE article_id <> 1`);
      })
      .then(({ rows }) => {
        rows.forEach((row) => {
          expect(row.votes).toBe(0);
        });
      });
  });
  test("404: Responds with 'Not Found' if an article with the requested ID does not exist in the database", () => {
    return request(app)
      .patch("/api/articles/500")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this value");
      });
  });
  test("400: Responds with 'Bad Request' if the requested ID is not valid", () => {
    return request(app)
      .patch("/api/articles/notAnId")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid value");
      });
  });
  test("400: Responds with 'Bad Request' if incomplete data provided", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incomplete data provided: missing inc_votes");
      });
  });
  test("400: Responds with 'Bad Request' if the data provided is not valid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "notANumber" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid value");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: No content", () => {
    return request(app)
      .delete("/api/articles/3")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM articles`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(12);
      })
      .then(() => {
        return db.query(`SELECT * FROM articles WHERE article_id = 3`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });
  test("404: Responds with 'Not Found' if an article with the request ID does not exist in the database", () => {
    return request(app)
      .delete("/api/articles/500")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this value");
      });
  });
  test("400: Responds with 'Bad Request' if the article ID provided is not valid", () => {
    return request(app)
      .delete("/api/articles/one")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid value");
      });
  });
  test("204: Deletes the article's comments as well", () => {
    return request(app)
      .delete("/api/articles/3")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE article_id = 3`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });
});
