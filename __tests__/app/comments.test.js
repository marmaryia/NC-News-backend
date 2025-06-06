const { app, request, seed, data, db } = require("./test-setup");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of 10 comments for the article with the provided ID as default if no limit specified", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
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
        expect(msg).toBe("Nothing found with this value");
      });
  });
  test("400: Responds with 'Bad Request' if the provided ID is not valid", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid value");
      });
  });
  describe("?limit={number of responses}", () => {
    test("200: Responds with the number of responses specified by the limit", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(5);
        });
    });
    test("400: Responds with 'Bad Request' if the provided limit is not valid", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=five")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid value");
        });
    });
  });
  describe("?p={page at which to start}", () => {
    test("200: Responds with an array of objects offset by the requested number of pages", () => {
      return request(app)
        .get("/api/articles/1/comments?p=2&limit=7")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(4);
        });
    });
    test("200: Responds with an empty array if the requested page is out of scope", () => {
      return request(app)
        .get("/api/articles/1/comments?p=100")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(0);
        });
    });
    test("400: Responds with 'Bad Request' if the requested page is not valid", () => {
      return request(app)
        .get("/api/articles/1/comments?p=one")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid value");
        });
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
        expect(comment).toMatchObject({
          comment_id: 19,
          article_id: 2,
          body: "Fantastic!",
          votes: 0,
          author: "lurker",
          created_at: expect.any(String),
        });
      });
  });
  test("400: Responds with 'Bad Request' if the provided ID is not valid", () => {
    return request(app)
      .post("/api/articles/notAnId/comments")
      .send({ username: "lurker", body: "Fantastic!" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid value");
      });
  });
  test("404: Responds with 'Not Found' if the article with the provided ID does not exist in the database", () => {
    return request(app)
      .post("/api/articles/500/comments")
      .send({ username: "lurker", body: "Fantastic!" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this value");
      });
  });
  test("400: Responds with 'Bad Request' if the comment body to add to the article is incomplete", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "Fantastic!" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incomplete data provided: missing username");
      });
  });
  test("404: Responds with 'Not Found' if the foreign key in the comment body does not exist in the database", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: 5, body: "Fantastic!" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this value");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: No content", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(17);
      })
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = 3`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });
  test("400: Responds with 'Bad Request' if the provided ID is not valid", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid value");
      });
  });
  test("404: Responds with 'Not Found' if no comment with the provided ID exists in the database", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this value");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Responds with an object representing the updated comment", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(19);
        expect(comment.comment_id).toBe(2);
      });
  });
  test("200: Does not change other comments apart from the requested one", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1000 })
      .expect(200)
      .then(() => {
        return db.query(`SELECT votes FROM comments WHERE comment_id <> 1`);
      })
      .then(({ rows }) => {
        rows.forEach((row) => {
          expect(row.votes).toBeLessThan(101);
        });
      });
  });
  test("400: Responds with 'Bad Request' if the provided ID is not valid", () => {
    return request(app)
      .patch("/api/comments/notAnId")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid value");
      });
  });
  test("404: Responds with 'Not Found' if no comment with the provided ID exists in the database", () => {
    return request(app)
      .patch("/api/comments/1000")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Nothing found with this value");
      });
  });
  test("400: Responds with 'Bad Request' if incomplete data provided", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incomplete data provided: missing inc_votes");
      });
  });
  test("400: Responds with 'Bad Request' if the data provided is not valid", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "notANumber" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid value");
      });
  });
});
