app.controller("playersDivController",
  function ($rootScope, $scope, mySocket) {
  var GUIvars = {
    "#playersDiv": {
      expanded: false,
      resizing: false,
      collapsedSize: "6%",
      collapsedLeft: "94%",
      expandedSize: "15%",
      expandedLeft: "90%"
    },
    ".playerDivListFriend": {
      baseBGcolor: "#ffffff",
      hoverBGcolor: "red"
    }
  };

  $scope.playerFilter = "";
  
  /*$scope.players = [
    {
      username: "AngelOfDeath",
      profileImage: "http://vignette1.wikia.nocookie.net/youtubepoop/images/" +
        "f/f7/5Pikachu.png/revision/latest?cb=20141108062013"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100"
    },
    {
      username: "AngelOfDeath",
      profileImage: "http://vignette1.wikia.nocookie.net/youtubepoop/images/" +
        "f/f7/5Pikachu.png/revision/latest?cb=20141108062013"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100"
    }
  ];*/

  $scope.getFromServerAllPlayers = function () {
    mySocket.emit("getFromServerAllFriends", null);
  };
  mySocket.on("getFromServerAllPlayers_Response", function (data) {
    $scope.players = data;
  });

  $(".playersDivListPlayer").mouseover(function () {
    $(this).css({
      "background-color": GUIvars[".playersDivListPlayer"].hoverBGcolor 
    });
  });
  $(".friendsDivListFriend").mouseleave(function () {
    $(this).css({
      "background-color": GUIvars[".playersDivListPlayer"].baseBGcolor
    });
  });

  // Set selected player
  $scope.selectPlayerFromNav = function (username) {
    $rootScope.socialVars.selectedPlayer = username;
    console.log($rootScope.socialVars.selectedPlayer);
  };

  // Clear selected player
  $scope.clearSelectedPlayerFromNav = function () {
    $rootScope.socialVars.selectedPlayer = "";
  };

  // Add a friend
  $scope.addFriend = function (username) {
    mySocket.emit('getFromServerAddFriend', {
      username: username
    });
  };
  mySocket.on('getFromServerAddFriend_Response', function (data) {
    // Set $rootScope social variables
    // $rootScope.socialVars.friends = data.friends;
    // $rootScope.socialVars.friendsKeys = Object.keys(data.friends);
    console.log(data);
  });


});