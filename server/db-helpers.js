// Iterface between server and database
var db = require('../DB/models.js');

// Add a new record to the GameStats table
exports.addGameStats = function(userID, stats) {
  var newStats = stats;
  // Add the user ID to the stats
  newStats.userid = userID;

  var newGameStats = db.GameStats.build(newStats);
  newGameStats.save().then(function() {
    console.log("Saved a new game record to GameStats database");
  });
};

// Update the user's record in the BestStats table, or create one if not found
exports.updateBestStats = function(userID, stats) {
};

// Update the user's record in the TotalStats table, or create one if not found
exports.updateTotalStats = function(userID, stats) {

};