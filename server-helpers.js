//This will be a file to route information between the database and the client

var db = require('models.js');

//example function to send all user data from database

exports.sendUsers = function(){
	db.User.findAll().then(function(users){
		io.emit('allUsers', users);
	});
};

exports.sendFriends = function(username){

  //first find id for user

  //use id to search for user in Friends database
    //give us friends User ids

  //got back to User and search Friends' ids to get usernames

}

