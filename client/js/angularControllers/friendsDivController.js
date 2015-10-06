app.controller("friendsDivController", function ($rootScope, $scope, mySocket) {
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

  $scope.friendFilter = "";

  mySocket.on('receiveFromServerFriendOnline', function (data) {
    $rootScope.socialVars.friends[data.username]['status'] = data['status'];
  });

  //jQuery animation
  $scope.toggleFriendsDiv = function (forceClose) {
    if (!GUIvars["#friendsDiv"].resizing) {
      var width;
      var left;
      var opacity;
      if (!GUIvars["#friendsDiv"].expanded && !forceClose) {
        width = GUIvars["#friendsDiv"].expandedSize;
        left = GUIvars["#friendsDiv"].expandedLeft;
        opacity = 1;
      }
      else {
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
          start: function () {
            GUIvars["#friendsDiv"].resizing = true;
            if (GUIvars["#friendsDiv"].expanded) {
              $(".friendsDivListStatus").css({opacity: opacity});
            }
          },
          done: function () {
            GUIvars["#friendsDiv"].resizing = false;
            if (!GUIvars["#friendsDiv"].expanded) {
              $(".friendsDivListStatus").css({opacity: 1});
            }
            GUIvars["#friendsDiv"].expanded = !GUIvars["#friendsDiv"].expanded;
          },
          duration: 250
        }
      );
    }
  };

  $(".friendsDivListFriend").mouseover(function () {
    $(this).css({
      "background-color": GUIvars[".friendsDivListFriend"].hoverBGcolor 
    });
  });
  $(".friendsDivListFriend").mouseleave(function () {
    $(this).css({
      "background-color": GUIvars[".friendsDivListFriend"].baseBGcolor
    });
  });

});