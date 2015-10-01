exports.sockets = {
  // 123455: {
  //   username: Angel,
  //   userID: 123,
  //   gameRoom: 'The Room',
  //   skins: [],
  //   friends: []
  // }
};

exports.roomNames = [
  "The Room",
  "Hack Reactor",
  "Freehold",
  "San Francisco"
];

exports.roomData = {
  defaultMaxPlayersPerRoom: 10,
  maxRooms: 10,
  roomCount: 0,
  rooms: {}
};

exports.addRoom = function (size) {
  if (exports.roomData.roomCount < exports.roomData.maxRooms) {
    var newRoom = {
      roomName: exports.roomNames[exports.roomData.roomCount],
      maxPlayers: size || exports.roomData.defaultMaxPlayersPerRoom,
      playerInfo: {}
    };
    exports.roomData.rooms[newRoom.roomName] = newRoom;
    exports.roomData.roomCount++;
    console.log('\nA NEW ROOM has been CREATED.\n');
    return newRoom;
  } else {
    console.log('\nThe TOTAL ROOMS CAPACITY has been REACHED.\n');
  }
};

exports.removeRoom = function (roomName) {
  var roomRemoved = false;
  var roomIndex = exports.roomNames.indexOf(roomName);
  if (roomIndex !== -1 && roomName in exports.roomData.rooms) {
    exports.roomNames
      = exports.roomNames.slice(0, roomIndex)
        .concat(exports.roomNames.slice(roomIndex + 1));
    exports.roomNames.push(roomName);

    delete exports.roomData.rooms[roomName];
    roomRemoved = true;
    console.log('\nROOM', roomName, 'REMOVED.\n');
  } else {
    console.log('\nROOM', roomName, 'STAYS. !@#%!@!@^!#!\n');
  }
  return roomRemoved;
};

exports.addRoom();

exports.getValidPlayerPosition = function (roomName) {
  var result = {x: 0, y: 0};
  return result;
};

exports.addPlayerToRoom = function (roomName, player) {
  if (roomName in exports.roomData.rooms
    && (Object.keys(exports.roomData.rooms[roomName].playerInfo).length
      < exports.roomData.rooms[roomName].maxPlayers)) {

    var validPlayerPosition = exports.getValidPlayerPosition(roomName);
    exports.roomData.rooms[roomName].playerInfo[player.username] = {
      positionAndMass: [
        {
          x: validPlayerPosition.x,
          y: validPlayerPosition.y,
          mass: 1
        }
      ],
      skin: player.skin
    };

    exports.sockets[player.socketID].gameRoom = roomName;

    console.log('\nPLAYER', player.username,
      'ADDED TO ROOM', roomName, '\n.');
    return true;
  } else {
    console.log('\nPLAYER', player.username, 'COULD NOT JOIN',
      roomName, '\n. ?!?!??!?!!!?!');
  }
};

exports.removePlayerFromGame = function (data) {
  var gameRoom = exports.sockets[data.socketID].gameRoom;
  var username = exports.sockets[data.socketID].username;
  delete exports.roomData.rooms[gameRoom].playerInfo[username];
  exports.sockets[data.socketID].gameRoom = '';
  return gameRoom;
};


exports.updatePlayer = function (data) {
  exports.roomData.rooms[roomName].playerInfo[data.username].positionAndMass
    = data.positionAndMass;
};