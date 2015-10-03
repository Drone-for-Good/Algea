exports.sockets = {
  // 123455: {
  //   username: Angel,
  //   userID: 123,
  //   gameRoom: 'The Room',
  //   skins: [],
  //   friends: []
  // }
};

//According to the game mechanics, the player board size is:
var WORLD_WIDTH = 4096;
var WORLD_HEIGHT = 2048;

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
      playerInfo: {},
      food: {}
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

//will be used for valid player position and for valid food position
//checkFood is a boolean which says whether you need to check food positions
//Expected syntax of food -> id: {id: id, x: positionX, y: positionY}
exports.getValidPosition = function (checkFood, roomName) {
  //get random coordinates
  var coordinatesObj = exports.getCoordinates();
  //check if those coordinates are in use:
  var match = false;
  //object of all the players in the room
  var players = exports.roomData.rooms[roomName].playerInfo;
  for (var player in players){
    //need to go through player's positions to see if they match
    if (player.positionAndMass[0].x === coordinatesObj.x && player.positionAndMass[0].y
          === coordinatesObj.y){
      match = true;
      break;
    }
  };
  //need to go through food posiitions to see if they match
  if (match === false && checkFood){
    //object of all the food in room
    var foodInRoom = exports.roomData.food;
    for (var food in foodInRoom){
      if (food.x === coordinatesObj.x && food.y === coordinatesObj.y){
        match = true;
        break;
      }
    }
  }
  //if already a position, call it again to get different coordinates
  if (match === true){
    return exports.getValidPosition(roomName, checkFood);
  }
  return coordinatesObj;
};


exports.getCoordinates = function(){
  var xCoor = Math.round(Math.random * WORLD_WIDTH;
  var yCoor = Math.round(Math.random * WORLD_HEIGHT;

  return {x: xCoor, y: yCoor};
};

exports.addPlayerToRoom = function (roomName, player) {
  if (roomName in exports.roomData.rooms
    && (Object.keys(exports.roomData.rooms[roomName].playerInfo).length
      < exports.roomData.rooms[roomName].maxPlayers)) {

    var validPlayerPosition = exports.getValidPosition(roomName);
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

exports.addFood = function(foodId){
  //object with x and y coordinates
  var coordinates = getValidPosition(true);
  return {
    id: foodId,
    x: coordinates.x,
    y: coordinates.y
  };
}

//Front-end needs to signal the server when the food is eaten.
exports.removeFood = function(foodId){
  //this has to be done when the food is eaten
  delete exports.roomData.rooms[roomName].food[i];
}

//to be called in server's setTimeout
exports.refreshFood = function(roomName){
  //how much food on the board should be based on the size of the board and the
  //size of the food. For now, I'm hardcoding a number as filler.
  var foodQuantity = 100;
  for (i=0; i<foodQuantity; i++){
    if (!exports.roomData.food[i]){
      exports.roomData.rooms[roomName].food[i] = addFood(i);
    }
  }
};

exports.updatePlayer = function (data) {
  exports.roomData.rooms[roomName].playerInfo[data.username].positionAndMass
    = data.positionAndMass;
};