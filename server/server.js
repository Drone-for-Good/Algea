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

io.sockets.on('connection', function (socket) {

  console.log("\n" + socket.id, "connected.\n");
  game.sockets[socket.id] = {
    username: null,
    userID: null,
    rooms: [],
    skins: [],
    friends: []
  };

  socket.on('disconnect', function () {
    console.log("\n" + socket.id, "disconnected.\n");
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
    });
  });

  socket.on('getFromServerSignup', function (data) {
    return new Promise(function (resolve, reject) {
      resolve(dbHelpers.verifyUserSignup({
        username: data.username,
        password: data.password
      }));
    }).then(function (result) {
      console.log("RESULT", result);
      socket.emit('getFromServerSignup_Response', result);
    });
  });

  // When user enters a game
  socket.on('sendToServerNewPlayer', function(clientInfo){
    var promise = new Promise(function(resolve, reject){
      return dbHelpers.newPlayer(clientInfo);

      //IS IT POSSIBE TO DO THE FOLLOWING?
      // helpers.newPlayer(clientInfo, function(err, response){
      //     if (err){
      //         console.err('sendToServerPlayerState has an Error');
      //     } else {
      //         resolve(response);
      //     }
      // });
    });

    promise().then(function(serverResponse){      //not sure what the server response should be?
      io.emit('receiveFromServerNewPlayer', function(){

      });
    })
    .catch(function(err){
        console.err('Error in sendToServerNewPlayer');
        throw new Error(err);
    });
  });

  // While user is playing a game, user will emit this event at interval
  socket.on('sendToServerPlayerState', function(playerInfo){
      game.allPlayerInfo[socket.id] = playerInfo;
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

  // When a user in a game sends a chat message to the room
  // msg from client should be like this:
  // { username: 'Angel', chatMsg: 'i'm winning!' }
  socket.on('sendToServerChatMessage', function(msg) {
    // Get the room ID of the user; socket.rooms is a built-on object in socket.io
    // http://socket.io/docs/server-api/
    var roomID = socket.rooms[1];

    // Emit to only the users in the same room
    io.to(roomID).emit('receiveFromServerChatMessage', msg);
  });
});

//this will be an ongoing function to update players on the positions in
//server's global obj
// Need to emit for every room
setInterval(function(){
  var promise = new Promise(function(resolve, reject){
    //fetchStatusOfAllPlayersAndSendItOut!

    //need to handle resolve and reject
  })
  .then(function(allFriends){
    io.emit('receiveFromServer', function(){

    })
  })
  .catch(function(err){

  });
}, 100);


http.listen(3000, function(){
  console.log('listening on *:3000');
});