# Northcoders News API

Task 1 - 
You will need to create two .env files in your repo: .env.test and .env.development. See /db/setup.sql for the database names. In each .env file add PGDATABASE=, with the correct database name for that environment. Ensure the .env files are .gitignored.

--- 

/api endpoints 

GET /api = Responds with 200 and an object detailing all the available endpoints of the api.
Example: 
   {
        'GET /api': {
          description: 'serves up a json representation of all the available endpoints of the api'
        },
        'GET /api/topics': {
          description: 'serves an array of all topics',
          queries: [],
          exampleResponse: { topics: [Array] }
        },
        'GET /api/articles': {
          description: 'serves an array of all articles',
          queries: [ 'author', 'topic', 'sort_by', 'order' ],
          exampleResponse: { articles: [Array] }
        }
      }

GET /api/topics = Responds with 200 and an array of topic objects.
Example: 
[
  {
    description: 'The man, the Mitch, the legend',
    slug: 'mitch'
  },
  {
    description: 'Not dogs',
    slug: 'cats'
  },
  {
    description: 'what books are made of',
    slug: 'paper'
  }
];

--- 

Erros:
- handle404s: Responds to all requests with a 'Route Not Found' for invalid input. Eg. GET /api/tpics



This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
