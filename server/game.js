//global object to store current players' instantaneous data
// need to think about how to handle rooms
exports.allPlayerInfo = {
  // key is socket id, for example:
  // 12355: { lifetime: 3231, mass: 342, score: 342 ... etc },
  // 123d5: { lifetime: 3423, mass: 343, score: 565 ... etc }
};

// Maps socket id to user id
exports.sockets = {
  // key is the socket id, for example:
  // 123455: { username: Angel, userID: 123 },
  // 123454: { username: John, userID: 125 }
};

// Look up user id from exports.socket object
exports.getUserID = function(socketID) {
  return exports.sockets[socketID][userID];
};

// Look up user name from exports.socket object
exports.getUserName = function(socketID) {
  return exports.sockets[socketID][username];
};

// Upon sign in, user is assigned to his own room with an ID == to his socketID
// When user joins a game, we will assign his second room to the game's roomID
// While in game, get user's roomID with socket.rooms[1] - need to verify this works