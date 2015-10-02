var Sequelize = require("sequelize");

// Connect to the agar database with user root and "root" password
var sequelize = new Sequelize("agar", "root", "jljcr19");

// Sequelize auto adds for each entry: id that is a primary key and auto-increments
// createAt and updatedAt timestamps

// User account info
exports.User = sequelize.define('User', {
  username: {type: Sequelize.STRING, allowNull: false, unique: true},
  password: {type: Sequelize.STRING, allowNull: false},
  profileImage: {type: Sequelize.STRING}   // path to image file
});

// .sync creates table if not already in database
// table name is pluralized version of the model name: ie Users
exports.User.sync().then(function(){
  console.log("Successfully synced User table");
});

// Friend relationship between 2 users
exports.Friendship = sequelize.define('Friendship', {
  user1: {type: Sequelize.INTEGER, references: {model: exports.User, key:'id'}},
  user2: {type: Sequelize.INTEGER, references: {model: exports.User, key:'id'}}
});

exports.Friendship.sync().then(function(){
  console.log("Successfully synced Friendship table");
});

// Skin image for a user
exports.Skin = sequelize.define('Skin', {
  userid: {type: Sequelize.INTEGER, references: {model: exports.User, key:"id"} },
  skinImage: {type: Sequelize.STRING} // path to image file
});

exports.Skin.sync().then(function(){
  console.log("Successfully synced Skin table");
});

// Stats for one game of a user
exports.GameStats = sequelize.define('GameStats', {
  userid: {type: Sequelize.INTEGER, references: {model: exports.User, key:"id"} },
  lifetime: {type: Sequelize.INTEGER, defaultValue: 0},
  score: {type: Sequelize.INTEGER, defaultValue: 0},
  mass: {type: Sequelize.INTEGER, defaultValue: 0},
  totalKills: {type: Sequelize.INTEGER, defaultValue: 0},
  totalFood: {type: Sequelize.INTEGER, defaultValue: 0},
  timeInFirst: {type: Sequelize.INTEGER, defaultValue: 0}
});

exports.GameStats.sync().then(function(){
  console.log("Successfully synced GameStats table");
});

// Best of each stat for a user
exports.BestStats = sequelize.define('BestStats', {
  userid: {type: Sequelize.INTEGER, primaryKey: true,
    references: {model: exports.User, key:"id"} },
  lifetime: {type: Sequelize.INTEGER, defaultValue: 0},
  score: {type: Sequelize.INTEGER, defaultValue: 0},
  mass: {type: Sequelize.INTEGER, defaultValue: 0},
  totalKills: {type: Sequelize.INTEGER, defaultValue: 0},
  totalFood: {type: Sequelize.INTEGER, defaultValue: 0},
  timeInFirst: {type: Sequelize.INTEGER, defaultValue: 0}
});

exports.BestStats.sync().then(function(){
  console.log("Successfully synced BestStats table");
});

// Sum of each stat for a user
exports.TotalStats = sequelize.define('TotalStats', {
  userid: {type: Sequelize.INTEGER, primaryKey: true,
    references: {model: exports.User, key:"id"} },
  totalGames: {type: Sequelize.INTEGER, defaultValue: 0},
  lifetime: {type: Sequelize.INTEGER, defaultValue: 0},
  score: {type: Sequelize.INTEGER, defaultValue: 0},
  mass: {type: Sequelize.INTEGER, defaultValue: 0},
  totalKills: {type: Sequelize.INTEGER, defaultValue: 0},
  totalFood: {type: Sequelize.INTEGER, defaultValue: 0},
  timeInFirst: {type: Sequelize.INTEGER, defaultValue: 0}
});

exports.TotalStats.sync().then(function(){
  console.log("Successfully synced TotalStats table");
})