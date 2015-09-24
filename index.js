var app = require('express')();					//initiate server
var http = require('http').Server(app);			//create a new instance of an express server with http
var io = require('socket.io')(http);			//using socket IO to route the http requests
// var db = require('models.js');

app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');		//Need proper name and dir of client front-end page
});

//sets the path under which static files will be served
io.path('/');

io.sockets.on('connection', function(socket){
  console.log('Congratulations! You have a user and socket IO is connecting you.');

  //example of on data from user:
	//io.sockets.on('data', function(data){ 			//on getting data from database
		// io.emit("usersOnline", function(users){		//sending it out to client

		// });
	// });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});