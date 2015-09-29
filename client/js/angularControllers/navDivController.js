app.controller("navDivController", function ($scope, mySocket) {
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
    //POPULATE FRIENDS
    //POPULATE AVAILABLE GAME ROOMS
  });

  $scope.getFromServerSignup = function () {
    var signupData = {
      username: $("#signupUsername").val(),
      password: $("#signupUsername").val()
    };
    mySocket.emit("getFromServerSignup", signupData);
  };
  mySocket.on("getFromServerSignup_Response", function ( data ) {
    //POPULATE AVAILABLE GAME ROOMS
  });

  $scope.gameRoomsFilter = "";
  $scope.gameRooms = [
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
    }
  ];

  mySocket.on("receiveFromServerGameRooms", function (data) {
    $scope.gameRooms = data;
  });

});