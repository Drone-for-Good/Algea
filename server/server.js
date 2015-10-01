var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dbHelpers = require('../server/db-helpers.js');
var game = require('../server/game.js');
var Promise = require('bluebird');

// Serve static files
app.use(express.static(__dirname + '/../client'));
//sets the path under which static files will be served
io.path('/');

var serverAttributes = {
  chatMessageMaxSize: 72
};

io.sockets.on('connection', function (socket) {

  console.log("\n" + socket.id, "connected.\n");
  game.sockets[socket.id] = {
    username: null,
    userID: null,
    gameRoom: '',
    skins: [],
    friends: []
  };


  socket.on('disconnect', function () {
    console.log("\n" + socket.id, "disconnected.\n");
    game.removePlayerFromGame(socket.id);
    delete game.sockets[socket.id];
  });

  socket.on('getFromServerLogin', function (data) {
    return new Promise(function (resolve, reject) {
      resolve(dbHelpers.verifyUserLogin({
        username: data.username,
        password: data.password
      }));
    }).then(function (result) {
      socket.emit('getFromServerLogin_Response', result);
      if (result.passwordMatch) {
        game.sockets[socket.id].username = result.username;
        game.sockets[socket.id].userID = result.userid;
        game.sockets[socket.id].skins = result.skins;
        game.sockets[socket.id].friends = result.friends;
      }
    });
  });

  socket.on('getFromServerSignup', function (data) {
    return new Promise(function (resolve, reject) {
      resolve(dbHelpers.verifyUserSignup({
        username: data.username,
        password: data.password
      }));
    }).then(function (result) {
      socket.emit('getFromServerSignup_Response', result);
      if (result.passwordMatch) {
        game.sockets[socket.id].username = result.username;
        game.sockets[socket.id].userID = result.userid;
        game.sockets[socket.id].skins = result.skins;
        game.sockets[socket.id].friends = result.friends;

        game.addPlayerToRoom("The Room", {
          username: result.username,
          socketID: socket.id,
          skin: "SOME SKIN BREH"
        });
      }
    });
  });

  socket.on('sendToServerJoinGame', function (data) {
    var joined = game.addPlayerToRoom(data.roomName,
      { username: data.username });
    var result = { roomJoined: joined };
    if (joined) {
      socket.join(roomName);
      result.roomName = data.roomName;
    }
    socket.emit('receiveFromServerJoinGame', result);
  });

  socket.on('sendToServerLeaveGame', function (data) {
    game.removePlayerFromGameRoom(socket.id);
    socket.emit('receiveFromServerLeaveGame', {
      leaveSuccess: true
    });
  });

  // While user is playing a game, user will emit this event at interval
  socket.on('sendToServerPlayerState', function (data) {
    game.updatePlayer(data);
  });

  // When user dies in a game
  socket.on('sendToServerDeath', function(finalStats){
      //I made this into a promise so I can string together writing to
      //the database and returning data to the user asynchronously

      // Get user id associated with the socket id
      var userID = game.getUserID(socket.id);

      // Update the DB records of the user - do we need these in promises
      helpers.addGameStats(userID, finalStats);
      helpers.updateBestStats(userID, finalStats);
      helpers.updateTotalStats(userID, finalStats);

      var promise = new Promise(function(resolve, reject){
          return helpers.sendDeath(finalStats);           //NEED TO HANDLE AS RESOLVE AND REJECT
      });
      promise().then(function(dataForClient){
          io.emit('receiveFromServerDeath', function(){
            //for now I haven't made something back to the client.
          });
      })
      .catch(function(err){
          console.err('Error in sendToServerDeath promise.');
          throw new Error(err);
      });
  });

  //The following needs to be incorporated into sendToServerPlayerState
  socket.on('getFromServerAllFriends', function(friendRequest){
    var promise = new Promise(function(resolve, reject){

        helpers.sendFriends(friendRequest.userID);  //need to handle resolve and reject
    })
    .then(function(allFriends){
        io.emit('getFromServerAllFriends_Response', function(){

        });
    })
    .catch(function(err){

    });
  });

  socket.on('sendToServerChatMessage', function (data) {
    io.to(data.roomName).emit('receiveFromServerChatMessage',
      data.message.substring(0, serverAttributes.chatMessageMaxSize));
  });
});

//this will be an ongoing function to update players on the positions in
//server's global obj
// Need to emit for every room
setInterval(function(){
  for (var roomName in game.roomData.rooms) {
    io.to(roomName).emit('receiveFromServerGameState',
      game.roomData.rooms[roomName]);
  }
}, 100);

http.listen(3000, function(){
  console.log('listening on *:3000');
});