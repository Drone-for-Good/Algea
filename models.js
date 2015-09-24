var Sequelize = require("sequelize");

// Connect to the agar database with user root and "" password
var sequelize = new Sequelize("agar", "root", "");

// Define all models
// Sequelize auto adds createAt and updatedAt timestamps for each entry

// User holds user account info
module.exports.User = sequelize.define('User', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  username: {type: Sequelize.STRING, allowNull: false, unique: true},
  password: {type: Sequelize.STRING, allowNull: false},
  status: {type: Sequelize.STRING}
});

// UserStats holds historical game stats of the user
module.exports.UserStats = sequelize.define('UserStats', {
  userid: {type: Sequelize.INTEGER, primaryKey: true,  references: {model: User, key:id} },
  highestScore: {type: Sequelize.INTEGER, defaultValue: 0},
  averageScore: {type: Sequelize.INTEGER, defaultValue: 0},
  gamesPlayed: {type: Sequelize.INTEGER, defaultValue: 0},
  KDR: {type: Sequelize.FLOAT, defaultValue: 0},
  kills: {type: Sequelize.INTEGER, defaultValue: 0},
  deaths: {type: Sequelize.INTEGER, defaultValue: 0},
});

// Friendship holds friend relationship between 2 users
module.exports.Friendship = sequelize.define('Friendship', {
  user1: {type: Sequelize.INTEGER, references: {model: User, key:id}},
  user2: {type: Sequelize.INTEGER, references: {model: User, key:id}}
});


// Create all tables that aren't already in the database

module.exports.User.sync().success(function() {
  console.log("Successfully synced User table");
});

module.exports.UserStats.sync().success(function() {
  console.log("Successfully synced UserStats table");
});