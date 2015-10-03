// Iterface between server and database
var db = require('../DB/models.js');

// Add a new record to the GameStats table
exports.addGameStats = function (userID, stats) {
  var newStats = stats;
  // Add the user ID to the stats
  newStats.userid = userID;

  var newGameStats = db.GameStats.build(newStats);
  newGameStats.save().then(function () {
    console.log("Saved a new game record to GameStats database");
  });
};

// Update the user's record in the BestStats table, or create one if not found
exports.updateBestStats = function (userID, stats) {
  db.bestStats.findOrCreate({userid:userID}).then(function (bestStats) {
    if (finalStats.lifetime > bestStats.lifetime) {
      bestStats.lifetime = finalStats.lifetime;
    }
    if (finalStats.score > bestStats.score) {
      bestStats.score = finalStats.score;
    }
    if (finalStats.mass > bestStats.mass) {
      bestStats.mass = finalStats.mass;
    }
    if (finalStats.totalKills > bestStats.totalKills) {
      bestStats.totalKills = finalStats.totalKills;
    }
    if (finalStats.totalFood > bestStats.totalFood) {
      bestStats.totalFood = finalStats.totalFood;
    }
    if (finalStats.timeInFirst > bestStats.timeInFirst) {
      bestStats.timeInFirst = finalStats.timeInFirst;
    }
  });
};

// Update the user's record in the TotalStats table, or create one if not found
exports.updateTotalStats = function (userID, stats) {
  db.TotalStats.findOrCreate({userid:userID}).then(function (currentStats) {
    currentStats.lifetime += finalStats.lifetime;
    currentStats.score += finalStats.score;
    currentStats.mass += finalStats.mass;
    currentStats.totalKills += finalStats.totalKills;
    currentStats.totalFood += finalStats.totalFood;
    currentStats.timeInFirst += finalStats.timeInFirst;
  });
};

//Make a new user
exports.newUser = function (clientInfo) {
  //Find user with username
  return db.User.find({
    where: { username: clientInfo.username }
  }).then(function (user) {
    var result = { userCreated: false };
    //If no user was found, name is available
    if (!user) {
      //Create user
      return db.User.create(clientInfo).then(function (newUser) {
        result.userCreated = true;
        return result;
      });
    }
    return result;
  });
};

//Verify a user when they login
exports.verifyUserLogin = function (data) {
  return db.User.find({
    where: { username: data.username }
  }).then(function (user) {
    //Assume username wasn't found
    var result = { userFound: false };
    //If username was found
    if (user) {
      result.userFound = true;

      //Check if passwords match
      result.passwordMatch = false;
      if (data.password === user.password) {
        result.passwordMatch = true;
      } else {
        return result;
      }

      //Username and password match, so return all data
      result.username = user.username;
      result["userid"] = user["id"];
      result.profileImage = user.profileImage;
      result.skins = [];
      result.friends = {};
      //Populate skins parameter on result object
      return exports.userSkins(result).then(function (skinResult) {
        //Populate friends parameter on result object
        return exports.userFriends(result).then(function (completeResult) {
          //Return completed user object
          return completeResult;
        });
      });
    }
    return result;
  });
};

//Verify a user when they signup
exports.verifyUserSignup = function (data) {
  //Handoff data to newUser
  return exports.newUser(data).then(function (result) {
    //If user was created, result is the user object
    if (result.userCreated) {
      //Verify login to log user in and get all (empty) data
      //for new user
      return exports.verifyUserLogin({
        username: data.username,
        password: data.password
      }).then(function (loginResult) {
        //Return logged in user
        loginResult.userCreated = true;
        return loginResult;
      });
    }
    return result;
  });
};

//Get all user skins
exports.userSkins = function (data) {
  return db.Skin.findAll({
    where: { userid: data.userid }
  }).then(function (skins) {
    data.skins = skins;
    console.log(Array.isArray(skins));
    return data;
  });
};

// Get all user friends
// NOTE: PROMISE HELL AHEAD, could be avoided with INNER JOIN
exports.userFriends = function (data) {
  // Find friends where we match the user1 id
  return db.Friendship.findAll({
    where: { user1: data.userid }
  }).then(function (friends_user2) {
    // Iterate over all friendships
    var user2IDs = [];
    for (var i = 0; i < friends_user2.length; ++i) {
      user2IDs.push(friends_user2[i].dataValues.user2);
    }
    // Find all users with user IDs in user2IDs
    return db.User.findAll({
      where: {
        id: {
          $in: user2IDs
        }
      }
    }).then(function (users) {
      // Add user data
      for (var i = 0; i < users.length; ++i) {
        data.friends[users[i].username] = {
          profileImage: users[i].profileImage,
          status: 'offline'
        };
      }

      //Find friends where we match the user2 id
      return db.Friendship.findAll({
        where: { user2: data.userid }
      }).then(function (friends_user1) {
        // Iterate over all friendships
        var user1IDs = [];
        for (var i = 0; i < friends_user1.length; ++i) {
          user1IDs.push(friends_user1[i].dataValues.user1);
        }
        
        // Find all users with user IDs in user1IDs
        return db.User.findAll({
          where: {
            id: {
              $in: user1IDs
            }
          }
        }).then(function (users) {
          //Add user data
          for (var i = 0; i < users.length; ++i) {
            data.friends[users[i].username] = {
              profileImage: users[i].profileImage,
              status: 'offline'
            };
          }
        }).then(function (){
          //Return original data object with newly populated friends
          return data;
        });
      });
    });
  });
};