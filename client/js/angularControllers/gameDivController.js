app.controller("gameDivController", function ($scope, mySocket) {
  var GUIvars = {
  };

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
          "some_virus_id_0_here"
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
    mySocket.emit("sendToServerPlayerState", playerData);
  };
  mySocket.on("receiveFromServerPlayerData", function (data) {
    //FOR ANY NEW PLAYER ON MAP, CREATE PLAYER
    //UPDATE PLAYER POSITIONS AND MASSES ON MAP
  });

  $scope.sendToServerDeath = function () {
    var performanceStats = {
      lifetime: "get_lifetime_from_game",
      score: "get_score_from_game",
      mass: "get_mass_from_game",
      totalKills: "get_totalKills_from_game",
      totalFood: "get_totalFood_from_game",
      //TODO: add totalVirus here
      totalVirus: "get_totalVirus_from_game",
      timeInFirst: "get_timeInFirst_from_game"
    };
    mySocket.emit("sendToServerDeath", performanceStats);
  };
  mySocket.on("receiveFromServerDeath", function (data) {
    //TELL THE USER HOW THEY DID
    //SHOW THEM THEIR HISTORICAL STATS
    //SHOW THEM THEIR BEST STATS
  });

});
