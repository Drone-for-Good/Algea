var app = angular.module("myApp", []);

app.controller("friendsDivController", function($scope){
  $scope.friends = [
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
    }
  ];

  // $scope.getFromServerAllFriends = function(){
  //   socket.emit("getFromServerAllFriends", null);
  // };
  // socket.on("getFromServerAllFriends_Response", function(data){
  //   $scope.friends = data;
  // });


});