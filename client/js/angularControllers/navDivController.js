app.controller("navDivController", function ($rootScope, $scope, mySocket) {
  var GUIvars = {
  };

  $scope.getFromServerLogin = function () {
    var loginData = {
      username: $("#loginUsername").val(),
      password: $("#loginPassword").val()
    };
    mySocket.emit("getFromServerLogin", loginData);
  };
  mySocket.on("getFromServerLogin_Response", function (data) {
    //If successful, close modal
    if (data.passwordMatch) {
      $scope.handleSuccessfulLogin(data);
    }
  });

  $scope.getFromServerSignup = function () {
    var signupData = {
      username: $("#signupUsername").val(),
      password: $("#signupUsername").val()
    };
    mySocket.emit("getFromServerSignup", signupData);
  };
  mySocket.on("getFromServerSignup_Response", function (data) {
    //If successful, close modal and use data
    if (data.passwordMatch) {
      $scope.handleSuccessfulLogin(data);
    }
  });

  //Handles data after successful login
  $scope.handleSuccessfulLogin = function (data) {
    //Close modal
    $('#showLoginModal').trigger('click');

    // Set $rootScope game variables
    $rootScope.gameVars.username = data.username;
    $rootScope.gameVars.skins = data.skins;

    // Set $rootScope social variables
    $rootScope.socialVars.friends = data.friends;
    $rootScope.socialVars.friendsKeys = Object.keys(data.friends);

    //Populate rooms
    $scope.gameRooms = data.rooms;
    console.log($rootScope.socialVars);
  };
  // Player can only try to join one room at a time
  $scope.joiningRoom = false;
  $scope.joinRoom = function (roomName) {
    if (!$scope.joiningRoom) {
      var roomData = {
        roomName: roomName,
        username: $rootScope.gameVars.username
      };
      mySocket.emit('sendToServerJoinGame', roomData); 
    }
  };
  mySocket.on('receiveFromServerJoinGame', function (data) {
    if(data.roomJoined){
      //Successfully joined room
    } else {
      //Unable to join room
    }
    $scope.joiningRoom = true;
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