$(document).ready(function () {

  var GUIvars = {
    //Nav
    "#navDiv": {
      expanded: false,
      resizing: false,
      collapsedSize: "6%",
      expandedSize: "15%"
    }
  };

  var initializeGUI = function () {
    $("#navDiv").css("height", window.innerHeight);
    $("#navDiv").css("width", GUIvars["#navDiv"].expandedSize);
    $("#friendsDiv").css("height", window.innerHeight/2);
    $("#friendsDivList").css("height",
      "" + (70 - 
        ($("#friendsDivTitle").height()
          + $("#friendsDivListFind_Input").height())/window.innerHeight) + "%");
    $("#playersDiv").css("height", window.innerHeight/2);
    $("#playersDiv").css("top", "50%");
    $("#playersDivList").css("height",
      "" + (60 - $("#playersDivTitle").height()/window.innerHeight) + "%");
    $("#gameDiv").css("height", window.innerHeight * .9);
    // $("#gameChatDiv").css("top", $("#gameDiv").height() - 230);
    // $("#gameChatDivInput").css({
    //   "top": $("#gameChatDiv").height()
    //         - $("#gameChatDivInput").height()
    //         - 10
    //   });
  };
  initializeGUI();

  $(window).resize(function () {
    $("#navDiv").css("height", window.innerHeight);
    $("#friendsDiv").css("height", window.innerHeight/2);
    $("#playersDiv").css("height", window.innerHeight/2);
  });

});