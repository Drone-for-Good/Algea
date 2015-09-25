var app = require('express')();					//initiate server
var http = require('http').Server(app);			//create a new instance of an express server with http
var io = require('socket.io')(http);			//using socket IO to route the http requests
// var db = require('models.js');
var helpers = require('server-helpers');
var Promise = require('bluebird');

var allPlayerInfo = {};                         //global object to store current players' instantaneous data

app.get('/', function(request, response){
	response.sendFile(__dirname + '/client/index.html');	//
});

//sets the path under which static files will be served
io.path('/');

io.sockets.on('connection', function(socket){
  console.log('Congratulations! You have a new user connected.');
  //socket.id will be associated with user through login
  socket.on('getFromServerLogin', function{
      //Add a new socket to object based on login

  });

  socket.on('sendToServerDeath', function(finalStats){
      //I made this into a promise so I can string together writing to
      //the database and returning data to the user asynchronously
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

  //as players send their state, it will be tracked in allPlayerInfo (global)
  socket.on('sendToServerPlayerState', function(playerInfo){
      var socketID = socket.id; //is this how I access this?
      allPlayerInfo[socketID] = playerInfo;
  });

  socket.on('sendToServerNewPlayer', function(clientInfo){
      var promise = new Promise(function(resolve, reject){
          return helpers.newPlayer(clientInfo);

          //IS IT POSSIBE TO DO THE FOLLOWING?
          // helpers.newPlayer(clientInfo, function(err, response){
          //     if (err){
          //         console.err('sendToServerPlayerState has an Error');
          //     } else {
          //         resolve(response);
          //     }
          // });
      });

      promise().then(function(serverResponse){                //not sure what the server response should be?
          io.emit('receiveFromServerNewPlayer', function(){

          });
      })
      .catch(function(err){
          console.err('Error in sendToServerNewPlayer');
          throw new Error(err);
      });
  });

  socket.on('getFromServerAllFriends', function(friendRequest){
      var promise = new Promise(function(resolve, reject){
          var socketID = socket.id;
          var username = allPlayerInfo[socket.id].username;

          helpers.sendFriends(username);  //need to handle resolve and reject
      })
      .then(function(allFriends){
          io.emit('getFromServerAllFriends_Response', function(){

          });
      })
      .catch(function(err){

      });
  });

});


//this will be an ongoing function to update players on the positions in
    //server's global obj
setTimeOut(function(){
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