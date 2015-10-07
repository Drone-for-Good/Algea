var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dbHelpers = require('../server/db-helpers.js');
var game = require('../server/game.js');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

// Serve static files
app.use(express.static(__dirname + '/../client'));
//sets the path under which static files will be served
io.path('/');

//Attributes specific to the server
var serverAttributes = {
  chatMessageMaxSize: 72
};

//On connection
io.sockets.on('connection', function (socket) {

  console.log("\n" + socket.id, "connected.\n");
  //Initialize socket information
  game.sockets[socket.id] = {
    username: null,
    userID: null,
    gameRoom: '',
    skins: [],
    friends: {}
  };

  //On disconnect
  socket.on('disconnect', function () {
    game.removePlayerFromGame({socketID: socket.id});
    //Remove socket and place user offline
    var username = game.sockets[socket.id].username;
    var friends = game.sockets[socket.id].friends;

    //Delete socket information
    delete game.sockets[socket.id];
    delete game.onlineUsers[username];

    //Check for any friends online
    findFriendsOnlineAndNotify(username, friends, 'offline');

    console.log("\nSOCKET " + socket.id, "disconnected.");
    console.log("USERNAME " + (username || 'anonymous'), 'is offline.\n');
  });

  //On login attempt
  socket.on('getFromServerLogin', function (data) {
    //If user already logged in, fail
    if (data.username in game.onlineUsers) {
      socket.emit('getFromServerLogin_Response',
        {
          userFound: true,
          userOnline: true
        });
      return;
    }

    //Proceed because user doesn't exist or is offline
    return new Promise(function (resolve, reject) {
      resolve(dbHelpers.verifyUserLogin({
        username: data.username,
        password: data.password
      }));
    }).then(function (result) {
      if (result.passwordMatch) {
        //Populate user data
        game.sockets[socket.id].username = result.username;
        game.sockets[socket.id].userID = result.userid;
        game.sockets[socket.id].skins = result.skins;
        game.sockets[socket.id].friends = result.friends;

        //Check for any friends online
        findFriendsOnlineAndNotify(result.username,
          result.friends, 'online');

        //Get all rooms
        result.rooms = game.allRooms();

        //Put user online
        game.onlineUsers[result.username] = socket.id;
      }
      socket.emit('getFromServerLogin_Response', result);
    });
  });

  // On signup attempt
  socket.on('getFromServerSignup', function (data) {
    return new Promise(function (resolve, reject) {
      resolve(dbHelpers.verifyUserSignup({
        username: data.username,
        password: data.password
      }));
    }).then( function (result) {
      if (result.passwordMatch) {
        game.sockets[socket.id].username = result.username;
        game.sockets[socket.id].userID = result.userid;
        game.sockets[socket.id].skins = result.skins;
        game.sockets[socket.id].friends = result.friends;

        // Check for any friends online
        findFriendsOnlineAndNotify(result.username,
          result.friends, 'online');

        // Get all rooms
        result.rooms = game.allRooms();

        // Put user online
        game.onlineUsers[result.username] = socket.id;
      }
      socket.emit('getFromServerSignup_Response', result);
    });
  });

  // On add friend attempt
  socket.on('getFromServerAddFriend', function (data) {
    return (new Promise(function (resolve, reject) {
      resolve(dbHelpers.makeFriends(game.sockets[socket.id].username,
      data.username));
    })).then(function (result) {
        // If friendship was made
        if (result.friendshipMade) {
          // Populate friends

        } else {
          // Friendship wasn't made
          console.log('friendship failed');
        }
        socket.emit('getFromServerAddFriend_Response',
          result);
      });
  });

  // On join game attempt
  socket.on('sendToServerJoinGame', function (data) {
    var result = game.addPlayerToRoom(data.roomName,
      {
        username: data.username,
        socketID: socket.id
      });
    // Join room on success
    if (result.roomJoined) {
      socket.join(result.roomName);
    }
    socket.emit('receiveFromServerJoinGame', result);
  });

  socket.on('sendToServerLeaveGame', function (data) {
    game.removePlayerFromGame({socketID: socket.id});
    socket.emit('receiveFromServerLeaveGame', {
      leaveSuccess: true
    });
  });

  //On individual player update
  socket.on('sendToServerPlayerState', function (data) {
    // Update player
    game.updatePlayer({
      roomName: data.roomName,
      username: data.username,
      positionAndRadius: data.positionAndRadius
    });
    // Update eaten food
    if (0 < data.eatenFoodIDs.length) {
      game.deleteFood(game.sockets[socket.id].gameRoom, data.eatenFoodIDs);
    }
  });

  // On individual cell death
  socket.on('sendToServerCellEaten', function(data) {
    // Inform player they may increase their size
    io.to(game.onlineUsers[data.username])
      .emit('receiveFromServerCellEaten', data);
  });

  // On individual player death
  socket.on('sendToServerDeath', function (finalStats) {
    //I made this into a promise so I can string together writing to
    //the database and returning data to the user asynchronously

    // Get user id associated with the socket id
    var userID = game.sockets[socket.id].userID;

    // If userID was found
    if (userID !== undefined) {
      // Update the DB records of the user - doesn't need to be in promise
      dbHelpers.updateStats(finalStats);
      // dbHelpers.addGameStats(userID, finalStats);
      // dbHelpers.updateBestStats(userID, finalStats);
      // dbHelpers.updateTotalStats(userID, finalStats);

      // var promise = new Promise(function (resolve, reject) {
      //     resolve(dbHelpers.sendDeath(finalStats));
      // });
      // promise().then(function (data) {
      //     io.emit('receiveFromServerDeath', {
      //       message: 'Your data has been received!!!'
      //     });
      // })
      // .catch(function (err) {
      //     console.err('Error in sendToServerDeath promise.');
      //     throw new Error(err);
      // });
    }
  });

  //On individual chat message
  //NOTE: Include in setInterval later
  socket.on('sendToServerChatMessage', function (data) {
    data.message
      = data.message.substring(0, serverAttributes.chatMessageMaxSize);
    io.to(game.sockets[socket.id].gameRoom)
      .emit('receiveFromServerChatMessage', data);
  });
});

//Emit player data for every room
setInterval(function () {
  for (var roomName in game.roomData.rooms) {
    // Add new food
    game.refreshFood(roomName);
    io.to(roomName).emit('receiveFromServerGameState',
      game.roomData.rooms[roomName]
    );
    // Restore food params
    game.restoreFoodParams(roomName);
  };
}, 17);

//Emit server data every 5 seconds
setInterval(function () {
  var rooms = { rooms: game.allRooms() };
  //Only display rooms to players who are logged in
  for (var clientSocket in game.sockets) {
    if (game.sockets[clientSocket].username !== null) {
      io.to(clientSocket).emit('receiveFromServerRoomsData',
        rooms);
    }
  }
}, 5000);

// A function to see if a user's friends are online,
// and notify them about his online/offline status
var findFriendsOnlineAndNotify = function (baseUser, friends, status) {
  for (var friend in friends) {
    //If friend is online
    if (friend in game.onlineUsers) {
      //Mark status
      friends[friend]['status'] = status;
      //Notify online friends that baseUser is online
      io.to(game.onlineUsers[friend])
        .emit('receiveFromServerFriendOnline', {
          username: baseUser,
          status: status
        });
    }
  }
};

http.listen(3000, function(){
  console.log('listening on *:3000');
});