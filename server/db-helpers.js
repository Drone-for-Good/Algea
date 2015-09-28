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
  db.bestStats.findOrCreate({userid:userID}).then(function(bestStats){
    if (finalStats.lifetime > bestStats.lifetime){
      bestStats.lifetime = finalStats.lifetime;
    }
    if (finalStats.score > bestStats.score){
      bestStats.score = finalStats.score;
    }
    if (finalStats.mass > bestStats.mass){
      bestStats.mass = finalStats.mass;
    }
    if (finalStats.totalKills > bestStats.totalKills){
      bestStats.totalKills = finalStats.totalKills;
    }
    if (finalStats.totalFood > bestStats.totalFood){
      bestStats.totalFood = finalStats.totalFood;
    }
    if (finalStats.timeInFirst > bestStats.timeInFirst){
      bestStats.timeInFirst = finalStats.timeInFirst;
    }
  });
};

// Update the user's record in the TotalStats table, or create one if not found
exports.updateTotalStats = function(userID, stats) {
  db.TotalStats.findOrCreate({userid:userID}).then(function(currentStats){
    currentStats.lifetime += finalStats.lifetime;
    currentStats.score += finalStats.score;
    currentStats.mass += finalStats.mass;
    currentStats.totalKills += finalStats.totalKills;
    currentStats.totalFood += finalStats.totalFood;
    currentStats.timeInFirst += finalStats.timeInFirst;
  });
};

//expect clientInfo object to be { username: someName, password:someHash, profileImage: somePath }
exports.newUser = function(clientInfo){
  //not using findOrCreate because I don't want to overwrite an existing user
  db.User.find({username: clientInfo.username}).then(function(user){
    console.log('There is already a user by this name.');
    //this should actually pass back an error where the user is told that account exists
  }).then(function(){
    //will only then be created if not already in db
    db.User.create(clientInfo).then(function(){
      //return a confirmation of success
    });
  });
};

