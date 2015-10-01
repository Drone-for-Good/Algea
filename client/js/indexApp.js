var app = angular.module("myApp", ['btford.socket-io']);

app.factory("mySocket", function(socketFactory){
  window.globalSocket = socketFactory();

  return window.globalSocket;
});