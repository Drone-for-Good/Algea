// App initialization
var app = angular.module("myApp", ['btford.socket-io']);

// Initialize $rootScope variables
app.run(function ($rootScope) {
  $rootScope.gameVars = {
    roomPlayers: []
  };
  window.gameVars = $rootScope.gameVars;
  $rootScope.socialVars = {
    friendsObj: {},
    friendsKeys: [],
    selectedPlayer: ""
  };
});

// Create angular socket io
app.factory("mySocket", function(socketFactory){
  // Global socket attached to the window.
  window.globalSocket = socketFactory();

  return window.globalSocket;
});