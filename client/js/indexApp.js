var app = angular.module("myApp", ['btford.socket-io']);

app.factory("mySocket", function(socketFactory){
  return socketFactory();
});