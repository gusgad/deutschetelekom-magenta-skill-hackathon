'use strict';
module.exports = (sequelize, DataTypes) => {
  var Questions = sequelize.define('questions', {
    user_id: DataTypes.INTEGER,
    questions_text: DataTypes.TEXT,
    questions_answer: DataTypes.TEXT,
  }, {});
  Questions.associate = function(models) {
    // associations can be defined here
  };
  return Questions;
};