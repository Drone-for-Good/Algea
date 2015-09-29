app.controller("gameChatDivController", function ($scope, mySocket) {
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
    }
  ];

  $scope.sendToServerChatMessage = function () {
    if (0 < $("#gameChatDivInput").val().length
        && $("#gameChatDivInput").val().length <= 72) {
      mySocket.emit("sendToServerChatMessage", {
        message: $("#gameChatDivInput").text()
      });
    }
  };
  mySocket.on("receiveFromServerChatMessage", function (data) {
    $scope.messages.push(data);
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