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

});