app.controller("navDivController", function ($scope, mySocket) {
  var GUIvars = {
  };

  $scope.getFromServerLogin = function () {
    var loginData = {
      username: $("#loginUsername").val(),
      password: $("#loginPassword").val()
    };
    mySocket.emit("getFromServerLogin", loginData);

    //I dont know where were storing the current user's username.
    //Change this if necessary
    $scope.username = loginData.username;
  };
  mySocket.on("getFromServerLogin_Response", function (data) {
    //POPULATE FRIENDS
    //Populate rooms
    $scope.gameRooms = data.rooms;
    //If successful, close modal
    if (data.passwordMatch) {
      $('#showLoginModal').trigger('click');
    }
  });

  $scope.getFromServerSignup = function () {
    var signupData = {
      username: $("#signupUsername").val(),
      password: $("#signupUsername").val()
    };
    mySocket.emit("getFromServerSignup", signupData);

    //I dont know where were storing the current user's username.
    //Change this if necessary
    $scope.username = signupData.username;
  };
  mySocket.on("getFromServerSignup_Response", function ( data ) {
    //Populate rooms
    $scope.gameRooms = data.rooms;
    //If successful, close modal
    if (data.passwordMatch) {
      $('#showLoginModal').trigger('click');
    }
  });

  $scope.joinRoom = function (roomName) {
    var roomData = {
      roomName: roomName,
      username: $scope.username
    };
    mySocket.emit('sendToServerJoinGame', roomData);
  };

  mySocket.on('receiveFromServerJoinGame', function (data) {
    if(data.roomJoined){
      //Successfully joined room
    } else {
      //Unable to join room
    }
  });

  mySocket.on('receiveFromServerGameState', function (data) {
    window.dataIWant = data;
  });

  $scope.gameRoomsFilter = "";
  $scope.gameRooms = [/*
    {
      roomName: "room0",
      count: 27,
      maxCount: 50
    },
    {
      roomName: "room1",
      count: 38,
      maxCount: 50
    },
    {
      roomName: "room2",
      count: 42,
      maxCount: 50
    },
    {
      roomName: "room3",
      count: 27,
      maxCount: 50
    },
    {
      roomName: "room4",
      count: 17,
      maxCount: 50
    },
    {
      roomName: "room5",
      count: 24,
      maxCount: 50
    },
    {
      roomName: "room6",
      count: 50,
      maxCount: 50
    },
    {
      roomName: "fishRoom",
      count: 6,
      maxCount: 50
    },
    {
      roomName: "room8",
      count: 23,
      maxCount: 50
    }*/
  ];

  mySocket.on('receiveFromServerRoomsData', function (data) {
    $scope.gameRooms = data.rooms;
  });
});