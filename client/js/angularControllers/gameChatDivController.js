app.controller("gameChatDivController", function ($rootScope, $scope, mySocket) {
  var GUIvars = {
    "#gameChatDiv": {
      expanded: true,
      resizing: false
    },
    "#minGameChatDiv": {
      mouseoutColor: "#ff0000",
      mouseoverColor: "#990000"
    }
  };

  $scope.messages = [
    /*{
      username: "zach_LFHoodie",
      message: "Mimi where is my hoodie at?"
    },
    {
      username: "AngelOfDeath",
      message: "I ate themmmmm ya"
    },
    {
      username: "hi_D",
      message: "time to do some tests"
    },
    {
      username: "alexIsn'tGood",
      message: "i don't have anything good to say so i won't"
    },
    {
      username: "alexIsn'tGood",
      message: "i don't have anything good to say so i won't"
    },
    {
      username: "alexIsn'tGood",
      message: "i don't have anything good to say so i won't"
    },
    {
      username: "alexIsn'tGood",
      message: "i don't have anything good to say so i won't"
    },
    {
      username: "alexIsn'tGood",
      message: "i don't have anything good to say so i won't"
    },
    {
      username: "zach_LFHoodie",
      message: "Mimi where is my hoodie at?"
    },
    {
      username: "AngelOfDeath",
      message: "I ate themmmmm ya"
    },
    {
      username: "hi_D",
      message: "time to do some tests"
    },
    {
      username: "hi_D",
      message: "time to do some tests"
    }*/
  ];

  //Send a chat message to the game room
  $scope.sendToServerChatMessage = function () {
    //If the username is defined (user logged in)
    if ($rootScope.gameVars.username){
      //If the chat message is of proper length
      if (0 < $("#gameChatDivInput").val().length
          && $("#gameChatDivInput").val().length <= 72) {
        mySocket.emit("sendToServerChatMessage", {
          username: $rootScope.gameVars.username,
          message: $("#gameChatDivInput").val()
        });
        $('#gameChatDivInput').val('');
      } 
    }
  };
  //Receive chat messages from the server
  mySocket.on("receiveFromServerChatMessage", function (data) {
    $scope.messages.push(data);

    $('#gameChatDivMessages').animate({
      scrollTop: $('#gameChatDivMessages')[0].scrollHeight
    }, 'slow');
  });

  //jQuery animation
  var toggleChatWindow = function () {
    if (!GUIvars["#gameChatDiv"].resizing) {
      GUIvars["#gameChatDiv"].resizing = true;
      if (GUIvars["#gameChatDiv"].expanded) {
        $("#gameChatDiv").animate({opacity: 0}, 500, function () {
          GUIvars["#gameChatDiv"].expanded = false;
          GUIvars["#gameChatDiv"].resizing = false;
        });
      }
      else {
        $("#gameChatDiv").animate({opacity: 1}, 500, function () {
          GUIvars["#gameChatDiv"].expanded = true;
          GUIvars["#gameChatDiv"].resizing = false;
        });
      }
    }
  };
  $("#minGameChatDiv").click(function () {
    toggleChatWindow();
  });
  $("#minGameChatDiv").mouseover(function () {
    $("#minGameChatDiv").css({
      "background-color": GUIvars["#minGameChatDiv"].mouseoverColor
    });
  });
  $("#minGameChatDiv").mouseout(function () {
    $("#minGameChatDiv").css({
      "background-color": GUIvars["#minGameChatDiv"].mouseoutColor
    });
  });

  document.onkeydown = function (e) {
    //C
    if (e.which === 67
      && !$("#gameChatDivInput").is(":focus")) {
      toggleChatWindow();
    }
  };

});