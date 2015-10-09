app.controller("gameDivController", function ($scope, mySocket) {
  var GUIvars = {
  };

  $scope.stats = {}

// Player state that keeps track of food eaten, virus hit, and position/mass.
  $scope.sendToServerPlayerState = function () {
    var playerData = {
      eatenFoodIDs:
        [
          "some_food_id_0_here",
          "some_food_id_1_here",
          "some_food_id_2_here",
        ],
      //TODO: add eatenVirusIDs (just 1, as there are way fewer viruses than food to be eaten. Maybe take out completely?):
      eatenVirusIDs:
        [
          "some_virus_id_0_here",
        ],
      positionAndMass:
        [
          {
            x: "blob_0_x_value_here",
            y: "blob_0_y_value_here",
            mass: "blob_0_mass_value_here"
          },
          {
            x: "blob_1_x_value_here",
            y: "blob_1_y_value_here",
            mass: "blob_1_mass_value_here"
          },
          {
            x: "blob_2_x_value_here",
            y: "blob_2_y_value_here",
            mass: "blob_2_mass_value_here"
          }
        ]
    };
    // ***************************************
    // Socket that EMITS and sends PlayerState data to the server.
    // ***************************************
    mySocket.emit("sendToServerPlayerState", playerData);
  };

  // ***************************************
  // Socket that listens for....................
  // *****************************************
  mySocket.on("receiveFromServerPlayerData", function (data) {
    //FOR ANY NEW PLAYER ON MAP, CREATE PLAYER
    //UPDATE PLAYER POSITIONS AND MASSES ON MAP
  });

  $scope.sendToServerLeaderboardStats = function () {
    var performanceStats = {

      username: window.agar.game.state.states.game.username,
      score: window.agar.game.state.states.game.score,
      lifetime: window.agar.game.state.states.game.lifetime,
      totalKills: 0
    };
    mySocket.emit("sendToServerLeaderboardStats", performanceStats);
  };

  setInterval($scope.sendToServerLeaderboardStats.bind($scope), 5000);


  mySocket.on("receiveFromServerDeath", function (data) {
    $scope.stats.highestScoreUser = data.highScoreUsername;
    $scope.stats.highestScore = data.score;
    $scope.stats.longestLifeUser = data.longLifeUsername;
    $scope.stats.longestLife = data.lifetime;
    //console.log("the data is !!!!!", data);
    //TELL THE USER HOW THEY DID
    //SHOW THEM THEIR HISTORICAL STATS
    //SHOW THEM THEIR BEST STATS
  });

});

  // $scope.sendToServerPlayerState = function () {
  //   var playerData = {
  //     eatenFoodIDs:
  //       [
  //         "some_food_id_0_here",
  //         "some_food_id_1_here",
  //         "some_food_id_2_here",
  //       ],
  //     positionAndMass:
  //       [
  //         {
  //           x: "blob_0_x_value_here",
  //           y: "blob_0_y_value_here",
  //           mass: "blob_0_mass_value_here"
  //         },
  //         {
  //           x: "blob_1_x_value_here",
  //           y: "blob_1_y_value_here",
  //           mass: "blob_1_mass_value_here"
  //         },
  //         {
  //           x: "blob_2_x_value_here",
  //           y: "blob_2_y_value_here",
  //           mass: "blob_2_mass_value_here"
  //         }
  //       ]
  //   };
  //   mySocket.emit("sendToServerPlayerState", playerData);
  // };

