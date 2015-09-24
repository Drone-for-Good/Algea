//This will be a file to route information between the database and the client

var db = require('models.js');

//example function to send all user data from database

exports.sendUsers = {

	db.Users.findAll().then(function(users){
		// console.log(users);		//to see what we're getting. According to sequalize docs, we're getting an instance not an object
		io.emit('allUsers', users);
	});

}