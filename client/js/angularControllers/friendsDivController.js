app.controller("friendsDivController", function($scope, mySocket){
  var GUIvars = {
    "#friendsDiv": {
      expanded: false,
      resizing: false,
      collapsedSize: "6%",
      collapsedLeft: "94%",
      expandedSize: "10%",
      expandedLeft: "90%"
    },
    ".friendsDivListFriend": {
      baseBGcolor: "#ffffff",
      hoverBGcolor: "#e0f5ff"
    }
  };

  $scope.friends = [
    {
      username: "AngelOfDeath",
      profileImage: "http://vignette1.wikia.nocookie.net/youtubepoop/images/" +
        "f/f7/5Pikachu.png/revision/latest?cb=20141108062013",
      status: "offline"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330",
      status: "online"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100",
      status: "idle"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330",
      status: "online"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100",
      status: "idle"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330",
      status: "online"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100",
      status: "idle"
    },
    {
      username: "AngelOfDeath",
      profileImage: "http://vignette1.wikia.nocookie.net/youtubepoop/images/" +
        "f/f7/5Pikachu.png/revision/latest?cb=20141108062013",
      status: "offline"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330",
      status: "online"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100",
      status: "idle"
    },
    {
      username: "alexWAShere",
      profileImage: "http://vignette1.wikia.nocookie.net/pokemon/images/a/ab/" +
        "143Snorlax_AG_anime.png/revision/latest?cb=20140924022330",
      status: "online"
    },
    {
      username: "hiD_destroys",
      profileImage: "http://vignette2.wikia.nocookie.net/pokemon/images/a/a0/" +
        "150Mewtwo_AG_anime_2.png/revision/20150101075100",
      status: "idle"
    }
  ];

  $scope.getFromServerFriend = function(){
    mySocket.emit("getFromServerFriend", null);
  };
  mySocket.on("getFromServerFriend_Response", function(data){
    $scope.friends = data;
  });

  mySocket.on("receiveFromServer", function(data){
    
  });

  //jQuery animation
  $scope.toggleFriendsDiv = function(forceClose){
    if(!GUIvars["#friendsDiv"].resizing){
      var width;
      var left;
      var opacity;
      if(!GUIvars["#friendsDiv"].expanded && !forceClose){
        width = GUIvars["#friendsDiv"].expandedSize;
        left = GUIvars["#friendsDiv"].expandedLeft;
        opacity = 1;
      }
      else{
        width = GUIvars["#friendsDiv"].collapsedSize;
        left = GUIvars["#friendsDiv"].collapsedLeft;
        opacity = 0;
      }
      $("#friendsDiv").animate(
        {
          width: width,
          left: left,
        },
        {
          start: function(){
            GUIvars["#friendsDiv"].resizing = true;
            if(GUIvars["#friendsDiv"].expanded){
              $(".friendsDivListStatus").css({opacity: opacity});
            }
          },
          done: function(){
            GUIvars["#friendsDiv"].resizing = false;
            if(!GUIvars["#friendsDiv"].expanded){
              $(".friendsDivListStatus").css({opacity: 1});
            }
            GUIvars["#friendsDiv"].expanded = !GUIvars["#friendsDiv"].expanded;
          },
          duration: 250
        }
      );
    }
  };

  $(".friendsDivListFriend").mouseover(function(){
    console.log("hey");
    $(this).css({
      "background-color": GUIvars[".friendsDivListFriend"].hoverBGcolor 
    });
  });
  $(".friendsDivListFriend").mouseleave(function(){
    $(this).css({
      "background-color": GUIvars[".friendsDivListFriend"].baseBGcolor
    });
  });

});