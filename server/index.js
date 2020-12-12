const express = require("express");
const app = express();
const cors = require("cors");
const Sequelize = require("sequelize");
const dbConfig = require("./config/config.json").development;
const User = require("./models").User;
const Questions = require("./models").questions;

connectToDatabase();

app.use(cors());

/* TEAM_02_CHECK_QUESTIONS */
app.get("/count-questions", async (req, res) => {
  try {
    const user = await User.findById(1);
    const questions = await Questions.findAll();

    const answeredQuestions = user.answered_questions.split(';').filter(question => question).map(question => {
      return JSON.parse(question);
    });

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



/* TEAM_02_MATCHES_COUNT */
app.get("/count-matches", async (req, res) => {
  try {
    const user = await User.findById(1);

    const answeredQuestions = user.answered_questions.split(';').filter(question => question).map(question => {
      return JSON.parse(question);
    });

    const questionMatches = {};

    answeredQuestions.forEach(answeredQuestion => {
      if (!questionMatches.hasOwnProperty(answeredQuestion.user_id)) {
        questionMatches[answeredQuestion.user_id] = 0;
      } 

      if (answeredQuestion.match) {
        questionMatches[answeredQuestion.user_id] += 1;
      }
    });

    let matchesCount = 0;

    for (let [questionMatch, value] of Object.entries(questionMatches)) {
      if (value >= 3) {
        matchesCount += 1;
      }
    }
    
    const response = { value: matchesCount };
    res.send(response);
  } catch (error) {
    res.status(422).send(error);
  }
});



/* TEAM_02_MATCHES_CONTACTS */
app.get("/contacts-matches", async (req, res) => {
  try {
    const user = await User.findAll();

    if (user[0].matched_users) {
      const matchedUserIDs = user[0].matched_users.split(',').filter(question => question).map(id => Number(id));

      const recentMatchId = matchedUserIDs.pop();

      const matchedPerson = user.find(user => {
        if (user.id === recentMatchId) {
          return user
        }
      })
      
      const response = { value: matchedPerson.username };
      res.send(response);
    } else {
      const response = { value: 0 };
      res.send(response);
      return;
    }
    
  } catch (error) {
    res.status(422).send(error);
  }
});



/* TEAM_02_ASK_QUESTIONS */
app.get("/questions-ask", async (req, res) => {
  try {
    const user = await User.findAll();
    const questions = await Questions.findAll();

    // check which questions has already been answered
    const answeredQuestionIDs = user[0].answered_questions.split(';').filter(question => question).map(question => {
      return JSON.parse(question);
    }).map(question => question.question_id);
    
    const unansweredQuestions = questions.filter(question => {
      if (!answeredQuestionIDs.includes(question.id)) {
        return true;
      } else { 
        return false;
      }
    });

    const latestUnansweredQuestion = unansweredQuestions.shift();
    
    const response = { value: latestUnansweredQuestion.questions_text };
    res.send(response);
  } catch (error) {
    res.status(422).send(error);
  }
});



/* TEAM_02_ASK_QUESTIONS_ANSWER */
app.get("/questions-answer/:answer", async (req, res) => {
  try {
    const answer = req.params.answer.toLowerCase().trim().includes('ja');
    const user = await User.findAll();
    const questions = await Questions.findAll();

    // check which questions has already been answered
    const answeredQuestionIDs = user[0].answered_questions.split(';').filter(question => question).map(question => {
      return JSON.parse(question);
    }).map(question => question.question_id);

    const unansweredQuestions = questions.filter(question => {
      if (!answeredQuestionIDs.includes(question.id)) {
        return true;
      } else { 
        return false;
      }
    });

    const latestUnansweredQuestion = unansweredQuestions.shift();
    const latestUnansweredQuestionAnswer = latestUnansweredQuestion.questions_answer.toLowerCase() === 'ja';

    console.log('JAEIN OTHER USER', latestUnansweredQuestionAnswer, 'US', answer)

    let answeredQuestionPayload;
    if (latestUnansweredQuestionAnswer === answer) {
      answeredQuestionPayload = {
        question_id: latestUnansweredQuestion.id,
        user_id: latestUnansweredQuestion.user_id,
        match: true
      };
    } else {
      answeredQuestionPayload = {
        question_id: latestUnansweredQuestion.id,
        user_id: latestUnansweredQuestion.user_id,
        match: false
      };
    }

    const formattedAnsweredQuestionPayload = {answered_questions: user[0].answered_questions + JSON.stringify(answeredQuestionPayload)+';'};
    User.update(formattedAnsweredQuestionPayload, { where: { id: 1 } }).then(async (result) => {

        // also check how many unanswered questions are left
        const answeredQuestions = user[0].answered_questions.split(';').filter(question => question).map(question => {
          return JSON.parse(question);
        });
    
        const questionsIds = questions.map(question => question.id);
        let unansweredQuestionsCount = 0;

        answeredQuestions.forEach(answeredQuestion => {
          if (questionsIds.includes(answeredQuestion.question_id)) {
            unansweredQuestionsCount += 1;
          }
        });

        if (answeredQuestionPayload.match) {
          // check if overall user match or not (same answers >=3)
          const ourUser = await User.findById(1);

          const answeredQuestions = ourUser.answered_questions.split(';').filter(question => question).map(question => {
            return JSON.parse(question);
          });

          const matchedUsers = ourUser.matched_users.split(',').filter(user => user).map(user => {
            return JSON.parse(user);
          });

          const questionMatches = {};

          answeredQuestions.forEach(answeredQuestion => {
            if (!questionMatches.hasOwnProperty(answeredQuestion.user_id)) {
              questionMatches[answeredQuestion.user_id] = 0;
            } 

            if (answeredQuestion.match) {
              questionMatches[answeredQuestion.user_id] += 1;
            }
          });

          let matchesCount = 0;
          let matchedUserIDs = [];
          for (let [questionMatch, value] of Object.entries(questionMatches)) {
            if (value >= 3) {
              matchesCount += 1;
              matchedUserIDs.unshift(Number(questionMatch));
            }
          }
          matchedUserIDs = JSON.stringify([...new Set(matchedUserIDs)]).replace('[', '').replace(']', '') + ',';
          let response;
          if (questionMatches[latestUnansweredQuestion.user_id] >= 3) {
            // we have a user match after 3 same answers
 
            User.update({matched_users: matchedUserIDs}, { where: { id: 1 } }).then(async (result) => {
              console.log(result);
            });
        
            response = { value: 'match', unanswered_questions_count: questionsIds.length - unansweredQuestionsCount - 1 };
          } else {
            // answer is same, but no match yet
            response = { value: 'no-match-yet', unanswered_questions_count: questionsIds.length - unansweredQuestionsCount - 1 };;
          }
          
          res.send(response);
        } else {
          // answers did not match at all
          response = { value: 'no-match', unanswered_questions_count: questionsIds.length - unansweredQuestionsCount - 1 };
          res.send(response);
        }
        
    });
    
    
  } catch (error) {
    res.status(422).send(error);
  }
});



/* TEAM_02_ASK_QUESTIONS_ANSWER */
app.get("/questions-add/:question", async (req, res) => {
  try {
    const question = req.params.question.toLowerCase().split('lautet')[1];

    function capitalizeFirstLetter(string) {
      const stringTrimmed = string.trim()
      return stringTrimmed.charAt(0).toUpperCase() + stringTrimmed.slice(1) + '?';
    }

    Questions.create(
      {
        user_id: 1,
        questions_text: capitalizeFirstLetter(question),
        questions_answer: null,
        createdAt: '2020-12-09 22:04:34',
        updatedAt: '2020-12-09 22:04:34'
      }
    ).then(() => {
      console.log('Question added.')
    }).catch(err => {
      console.log(err)
    });

    const response = { value: question };
    res.send(response);
  } catch (error) {
    res.status(422).send(error);
  }
});



/* TEAM_02_ADD_QUESTIONS_ANSWER_COMPLETE */
app.get("/questions-ask-complete/:answer", async (req, res) => {
  try {
    const answer = req.params.answer.toLowerCase().split('mit')[1].trim() === 'ja';

    Questions.update({questions_answer: answer ? 'Ja' : 'Nein'}, { where: { questions_answer: null } }).then(async (result) => {
      console.log(result);
    });

    const response = { value: answer };
    res.send(response);
  } catch (error) {
    res.status(422).send(error);
  }
});



/* TEAM_02_ADD_SOCIAL_MEDIA_USERNAME_ANSWER */
app.get("/social-media-add/:answer", async (req, res) => {
  try {
    const answer = req.params.answer.toLowerCase().split('lautet')[1].trim();

    User.update({username: answer }, { where: { id: 1 } }).then(async (result) => {
      console.log(result);
    });

    const response = { value: answer };
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
