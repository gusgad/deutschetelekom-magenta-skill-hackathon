"use strict";

const timestamp = new Date();

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          password: "abc123",
          createdAt: timestamp,
          updatedAt: timestamp,
          answered_questions: '{"question_id": 1, "match": true};{"question_id": 2, "match": false}'
        },
        {
          username: "Hannah",
          password: "abc123",
          createdAt: timestamp,
          updatedAt: timestamp,
          answered_questions: ''
        },
      ],
      {}
    );

    const questions = [
      "Speilst du gerne Gitarre?",
      "Magst du Tiere?",
      "Magst du Katzen?",
      "Magst du teure Autos?",
      "Faehrst du gerne Fahrrad?",
      "Trinkst du gerne Bier?",
      "Trinkst du gerne Wine?",
      "Trinkst du gerne Ayran?",
      "Trinkst du gerne Wodka?",
      "Isst du gerne Pizza?",
      "Isst du gerne Spetzle?",
      "Machst du gerne Sport?",
      "Spielst du gerne Fussball?",
      "Spielst du gerne Schach?",
      "Speilst du gerne Computerspiele?",
      "Hoerst du gerne Musik?",
      "Hoerst du gerne Justin Bieber?",
      "Hoerst du gerne Taylor Swift?",
      "Hoerst du gerne Schlagermusik?",
      "Gehst du oft spazieren?",
      "Wanderst du gerne?",
      "Schlaefst du gerne zu Hause?",
      "Unterhaeltst du dich gerne mit Freunden?",
      "Besuchst du gerne dine Familie?",
      "Hast du eine grosse Familie?",
      "Hast du Geschwister?",
      "Hast du einen Hund?",
      "Isst du gerne Junk Food?",
      "Gefaelt dir Ford Mustang?",
      "Trinkst du gerne Tee?",
      "Verbringst du gerne Zeit in der Natur?",
      "Guckst du gerne Netflix?",
      "Guckst du gerne Serien?"
    ].map(question => {
      return {
        user_id: 2,
        questions_text: question,
        questions_answer: Math.random() > 0.5 ? 'Ja' : 'Nein',
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    

    return queryInterface.bulkInsert(
      "questions",
      questions,
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};

/*
CREATE TABLE `boilerplate_db`.`questions` (
  `user_id` INT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `questions_text` VARCHAR(100) NULL,
  `questions_answer` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

  ALTER TABLE boilerplate_db.Users ADD answered_questions TEXT;

  INSERT INTO `boilerplate_db`.`questions` (`user_id`, `id`, `questions_text`, `questions_answer`) VALUES ('2', '5', 'Faehrst du gerne Autos?', 'Nein');

*/