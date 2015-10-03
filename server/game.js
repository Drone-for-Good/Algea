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

exports.onlineUsers = {
  // user1: user1SocketID
  // user 2: true,
  // ...
}

// All possible roomnames
exports.roomNames = [
  "The Room",
  "Hack Reactor",
  "Freehold",
  "San Francisco",
  "Mount Codepocalypse",
  "Tundra",
  "Forest",
  "Ocean"
];

// All room data
exports.roomData = {
  defaultMaxPlayersPerRoom: 10,
  maxRooms: 10,
  roomCount: 0,
  // Rooms of Key Value type roomName: (some room info)
  // all exist in the rooms object below
  rooms: {}
};

// A function to get all roomNames and current sizes
exports.allRooms = function () {
  var result = [];
  for(var roomName in exports.roomData.rooms) {
    result.push({
      roomName: roomName,
      maxCount: exports.roomData.rooms[roomName].maxPlayers,
      count:
        exports.roomData.rooms[roomName].playerCount
    });
  }
  return result;
};

// Add a room to roomData.rooms
exports.addRoom = function (size) {
  // If room limit hasn't been reached, create room
  if (exports.roomData.roomCount < exports.roomData.maxRooms) {
    var newRoom = {
      roomName: exports.roomNames[exports.roomData.roomCount],
      playerCount: 0,
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

// Remove a room
// NOTE ON CLEVER THING:
/*
Roomnames are picked by using exports.roomData.roomCount
as the index to reference a name from exports.roomNames

Suppose roomnames are ['a', 'b', 'c', 'd'], and 'a', 'b', 'c'
are currently up and running. If we turn off room 'b' (0 players),
now exports.roomData.roomCount will be decremented to 2. When
We need to create a new room, we will try and create
['a', 'b', 'c', 'd'][roomData.roomCount === 2] === 'c', but
'c' is already in use.

To avoid this, when we remove a room, we get the roomname ('b'),
remove it from exports.roomNames using Array.splice(), and
push it onto the end of exports.roomNames. This way, in the
example above, after removing a room, exports.roomNames would be
['a', 'c', 'd', 'b'], and exports.roomNames[2] is 'd', which is
not in use
*/
exports.removeRoom = function (roomName) {
  var roomRemoved = false;
  var roomIndex = exports.roomNames.indexOf(roomName);
  if (roomIndex !== -1 && roomName in exports.roomData.rooms) {
    exports.roomNames.splice(roomIndex, 1);
    exports.roomNames.push(roomName);
    delete exports.roomData.rooms[roomName];
    roomRemoved = true;
    console.log('\nROOM', roomName, 'REMOVED.\n');
  } else {
    console.log('\nROOM', roomName, 'STAYS. !@#%!@!@^!#!\n');
  }
  return roomRemoved;
};

// Add a room when starting the server
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

// Put a player in a new room
exports.addPlayerToRoom = function (roomName, data) {
  // If the roomName exists and
  // the player isn't already in the room and
  // the player count of the room is under the max
  if (roomName in exports.roomData.rooms
    && !(data.username in exports.roomData.rooms[roomName])
    && (exports.roomData.rooms[roomName].playerCount
      < exports.roomData.rooms[roomName].maxPlayers)) {

    // Make a player
    var validPlayerPosition = exports.getValidPlayerPosition(roomName);
    // Need radius, position, skin, and username to instantiate a player
    // clientside
    exports.roomData.rooms[roomName].playerInfo[data.username] = {
      positionAndRadius: [
        {
          x: validPlayerPosition.x,
          y: validPlayerPosition.y,
          radius: 50
        }
      ],
      skin: exports.sockets[data.socketID]['skins'][0] || ''
    };
    // Increment room count
    exports.roomData.rooms[roomName].playerCount++;
    // Set gameRoom on player
    exports.sockets[data.socketID].gameRoom = roomName;

    console.log('\nPLAYER', data.username,
      'ADDED TO ROOM', roomName, '.\n');
    return true;
  } else {
    console.log('\nPLAYER', data.username, 'COULD NOT JOIN',
      roomName, '\n. ?!?!??!?!!!?!');
  }
};

// Check if a new room is needed
exports.makeNewRoomIfNeeded = function () {
};

// Remove a player from their current game room
exports.removePlayerFromGame = function (data) {
  var gameRoom = exports.sockets[data.socketID].gameRoom;
  var username = exports.sockets[data.socketID].username;
  if (gameRoom !== '') {
    //Decrement roomCount
    exports.roomData.rooms[gameRoom].playerCount--;
    //Remove player information
    delete exports.roomData.rooms[gameRoom].playerInfo[username];
  }
  //Set gameRoom to be empty
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

// Update a player by referencing data on the client
// { username, roomName, positionAndRadius }
exports.updatePlayer = function (data) {
  exports.roomData.rooms[data.roomName]
    .playerInfo[data.username].positionAndRadius
    = data.positionAndRadius;
};