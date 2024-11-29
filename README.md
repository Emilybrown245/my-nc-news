**NC News API**

NC News API is a back-end application for interacting with RESTful API’s to host content for a news website. Some features include retrieving articles by topic and author ID, and fetching comments for a specific article. 

Examples of a few functional implementations include, the user having the ability to interact with the data received, by posting or deleting comments.

Moreover, my project also includes functionality to handle errors and invalid requests made by the user. 

You can view the hosted version **here** https://nc-news-lo7q.onrender.com

***- Instructions to get started -***

- Ensure you have Node.js and PostgresSQL installed

Git clone the repo link into your terminal eg. git clone https://github.com/your-username/my-nc-news.git 

- Once opened in VScode, run npm install to install all of the dependencies needed to run the code

***Note*** You will need to create two .env files in your repo: .env.test and .env.development. See /db/setup.sql for the database names. In each .env file add PGDATABASE=, with the correct database name for that environment. Ensure the .env files are .gitignored.

- To set up and seed the database run npm run seed

- To verify everything is working as intended run npm run test, all of the tests should pass

- To tests the hosted app’s functionality, naviagate to the endpoints.json file for available endpoints and apply them into the hosted apps URL. eg. https://nc-news-lo7q.onrender.com/api/articles

Here, as denoted by the endpoints.json file, you should see all of the articles from the production database.


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
