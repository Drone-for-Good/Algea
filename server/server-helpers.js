//This file routes information between the database and the client
var db = require('../DB/models.js');

exports.sendUsers = function(){

};

exports.sendFriends = function(username){
  var friendsArray;
  //first find id for user
  db.User.findOne({where: {'username' : username}}).then(function(user){
    userID = user.id;

    db.Friends.findAll({where: {key: user.id}}).then(function(friendsArr){
      for (var i=0; i<friendsArr.length; i++){
        friendsArray.push(friendsArr[i].user2.key);
      };
    });
  });
  //use id to search for user in Friends database
    //give us friends User ids

  //go back to User and search Friends' ids to get usernames
}

exports.sendDeath = function(finalStats){

  //final stats object needs to be written to database

  //CHECK ALL NAMES HERE. WE ARE STILL SYNCING UP WITH ONE ANOTHER
  //this should add to the database without needing to continue with the promise.
  db.GameStats.findOne({where: {key:user.id}}).then(function(currentStats){
    currentStats.lifetime += finalStats.lifetime;
    currentStats.score += finalStats.score;
    currentStats.mass += finalStats.mass;
    currentStats.totalKills += finalStats.totalKills;
    currentStats.totalFood += finalStats.totalFood;
    currentStats.timeInFirst += finalStats.timeInFirst;

    //still needs to handle "bestScore table"

  });

  //for now I haven't set this to send something back to the client.
};

exports.newPlayer = function(clientInfo){

};



