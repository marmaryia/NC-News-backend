# NC News

Hosted version: https://be-nc-news-jql4.onrender.com/api

This project mimics the backend service of a news website.

These dependencies need to be installed to run the code locally (npm install):

- Dev dependencies (for testing): husky, jest, jest-extended, jest-sorted, supertest.
- General dependencies: dotenv, express, pg, pg-format.

Two files need to be created locally:

- .env.test, setting PGDATABASE value to nc_news_test (for connection to the test database when running the code in the test environment);
- .env.development, setting PGDATABASE value to nc_news (for connection to the development database when running the code in the development environment).

To seed the local databases, npm run:

- setups-dbs (to create test and developement databases);
- test-seed (to seed the test database; the test database is (re)seeded automatically before each test);
- seed-dev (to seed the development database).

To run tests:

- npm run test (all tests);
  OR
- npm test test_file_name (only tests from the file).

Minimum recommended versions:

- Node.js 23.6.0
- Postgres 16.8
