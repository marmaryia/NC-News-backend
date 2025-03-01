const db = require("../connection");
const format = require("pg-format");
const {
  mapDataForInsertion,
  createLookupObject,
  convertTimestampToDate,
  addIdProperty,
} = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles");
    })
    .then(() => {
      return createTopics();
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createArticles();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      return insertTopics(topicData);
    })
    .then(() => {
      return insertUsers(userData);
    })
    .then(() => {
      return insertArticles(articleData);
    })
    .then(({ rows }) => {
      insertComments(commentData, rows);
    });
};

function createTopics() {
  return db.query(`
    CREATE TABLE topics
    (slug VARCHAR PRIMARY KEY NOT NULL UNIQUE, 
    description VARCHAR, 
    img_url VARCHAR(1000))`);
}

function createUsers() {
  return db.query(`
    CREATE TABLE users
    (username VARCHAR PRIMARY KEY NOT NULL UNIQUE, 
    name VARCHAR, 
    avatar_url VARCHAR(1000))`);
}

function createArticles() {
  return db.query(`
    CREATE TABLE articles
    (article_id SERIAL PRIMARY KEY, 
    title VARCHAR, 
    topic VARCHAR REFERENCES topics(slug) ON DELETE SET NULL,
    author VARCHAR REFERENCES users(username) ON DELETE SET NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000))`);
}

function createComments() {
  return db.query(`
    CREATE TABLE comments
    (comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR REFERENCES users(username) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
}

function insertTopics(topicData) {
  const formattedTopics = mapDataForInsertion(
    topicData,
    "slug",
    "description",
    "img_url"
  );
  const insertString = format(
    `INSERT INTO topics(slug, description, img_url) VALUES %L RETURNING *`,
    formattedTopics
  );
  return db.query(insertString);
}

function insertUsers(userData) {
  const formattedUsers = mapDataForInsertion(
    userData,
    "username",
    "name",
    "avatar_url"
  );
  const insertString = format(
    `INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *`,
    formattedUsers
  );
  return db.query(insertString);
}

function insertArticles(articleData) {
  const convertedArticles = articleData.map((article) =>
    convertTimestampToDate(article)
  );

  const formattedArticles = mapDataForInsertion(
    convertedArticles,
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url"
  );

  const insertString = format(
    `INSERT INTO articles(
    title,
    topic,
    author,
    body,
    created_at,
    votes,
    article_img_url) VALUES %L RETURNING *`,
    formattedArticles
  );
  return db.query(insertString);
}

function insertComments(commentData, articleRows) {
  const articleLookup = createLookupObject(articleRows, "title", "article_id");
  const commentsWithConvertedTimestamp = commentData.map((comment) =>
    convertTimestampToDate(comment)
  );
  const commentsWithId = addIdProperty(
    commentsWithConvertedTimestamp,
    articleLookup,
    "article_id",
    "article_title"
  );
  const formattedComments = mapDataForInsertion(
    commentsWithId,
    "article_id",
    "body",
    "votes",
    "author",
    "created_at"
  );

  const insertString = format(
    `INSERT INTO comments (
    article_id,
    body,
    votes,
    author,
    created_at
    ) VALUES %L RETURNING *`,
    formattedComments
  );
  return db.query(insertString);
}
module.exports = seed;
