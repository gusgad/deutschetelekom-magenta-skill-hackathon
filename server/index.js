const express = require("express");
const app = express();
const cors = require("cors");
const Sequelize = require("sequelize");
const dbConfig = require("./config/config.json").development;
const User = require("./models").User;
const Questions = require("./models").questions;

connectToDatabase();

app.use(cors());
app.get("/count", async (req, res) => {
  try {
    const user = await User.findById(1);
    const questions = await Questions.findAll();

    console.log('USER ANSWERE QUESTIONS', user.answered_questions.split(';').filter(question => question))

    const answeredQuestions = user.answered_questions.split(';').filter(question => question).map(question => {
      return JSON.parse(question);
    });

    console.log('USER ANSWERE QUESTIONS PARSED', answeredQuestions)
    const questionsIds = questions.map(question => question.id);
    let unansweredQuestionsCount = 0;

    answeredQuestions.forEach(answeredQuestion => {
      if (questionsIds.includes(answeredQuestion.question_id)) {
        unansweredQuestionsCount += 1;
      }
    });
    
    const response = { value: questionsIds.length - unansweredQuestionsCount };
    res.send(response);
  } catch (error) {
    res.status(422).send(error);
  }
});




app.listen(5000, () => console.log("The node.js app is listening on port 5000."));

function connectToDatabase() {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");

      //Check if database was seeded already, and do it if needed
      User.findById(1).then(user => {
        if (!user) {
          console.log("Database is not seeded, will run seeds now...");
          const { exec } = require("child_process");
          try {
            exec("/opt/node_modules/.bin/sequelize db:seed:all", (err, stdout, stderr) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log(stdout);
            });
          } catch (error) {
            console.log("Error while seeding database: ", error);
          }
        } else {
          console.log("Database already seeded.");
        }
      });
    })
    .catch(err => {
      console.log("Unable to connect to the database:", err);
    });
}
