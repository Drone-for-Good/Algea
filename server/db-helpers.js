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

exports.newUser = function (clientInfo) {
  return db.User.find({
    where: { username: clientInfo.username }
  }).then(function (user) {
    var result = { userCreated: false };
    if (!user) {
      return db.User.create(clientInfo).then(function (newUser) {
        result.userCreated = true;
        return result;
      });
    }
    return result;
  });
};

exports.verifyUserLogin = function (data) {
  return db.User.find({
    where: { username: data.username }
  }).then(function (user) {
    var result = { userFound: false };
    if (user) {
      result.userFound = true;

      result.passwordMatch = false;
      if (data.password === user.password) {
        result.passwordMatch = true;
      } else {
        return result;
      }

      result.username = user.username;
      result["userid"] = user["id"];
      result.profileImage = user.profileImage;
      result.skins = [];
      result.friends = [];
      return exports.userSkins(result).then(function (skinResult) {
        return exports.userFriends(result).then(function (completeResult) {
          return completeResult;
        });
      });
    }
    return result;
  });
};

exports.verifyUserSignup = function (data) {
  return exports.newUser(data).then(function (result) {
    if (result.userCreated) {
      return exports.verifyUserLogin({
        username: data.username,
        password: data.password
      }).then(function (loginResult) {
        loginResult.userCreated = true;
        return loginResult;
      });
    }
    return result;
  });
};

exports.userSkins = function (data) {
  return db.Skin.findAll({
    where: { userid: data.userid }
  }).then(function (skins) {
    data.skins = skins;
    return data;
  });
};

exports.userFriends = function (data) {
  return db.Friendship.findAll({
    where: { user1: data.userid }
  }).then(function (friends_user2) {
    data.friends = friends_user2;

    return db.Friendship.findAll({
      where: {user2: data.userid }
    }).then(function (friends_user1) {
      data.friends.concat(friends_user1);
      return data;
    });
  });
};

exports.loginUserInfo = function () {

};

