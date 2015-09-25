$(document).ready(function(){

  var GUIvars = {
    "#navDiv": {
      expanded: false,
      expanding: false,
      collapsedSize: "6%",
      expandedSize: "10%"
    },
    "#friendsDiv": {
      expanded: false,
      expanding: false,
      collapsedSize: "6%",
      collapsedLeft: "94%",
      expandedSize: "10%",
      expandedLeft: "90%"
    },
    "#gameChatDiv": {
      expanded: true,
      expanding: false
    },
    "#minGameChatDiv": {
      mouseoutColor: "#ff0000",
      mouseoverColor: "#cc0000"
    }
  };

  var initializeGUI = function(){
    $("#navDiv").css("height", window.innerHeight);
    $("#navDiv").css("width", GUIvars["#navDiv"].collapsedSize);
    $("#friendsDiv").css("height", window.innerHeight);
    $("#friendsDiv").css("width", GUIvars["#friendsDiv"].collapsedSize);
    $("#friendsDiv").css("left", GUIvars["#friendsDiv"].collapsedLeft);
    $("#gameDiv").css("height", window.innerHeight * .9);
    $("#gameChatDiv").css("top", $("#gameDiv").height() - 205);
    $("#gameChatDivInput").css({
      "top": $("#gameChatDiv").height() - $("#gameChatDivInput").height() - 10});
  };
  initializeGUI();


  var toggleNavDiv = function(){
    if(!GUIvars["#navDiv"].expanding){
      GUIvars["#navDiv"].expanding = true;
      if(!GUIvars["#navDiv"].expanded){
        $("#navDiv").animate({
          width: GUIvars["#navDiv"].expandedSize
        }, 250, function(){
          GUIvars["#navDiv"].expanded = true;
          GUIvars["#navDiv"].expanding = false;
        });
      }
      else{
        $("#navDiv").animate({
          width: GUIvars["#navDiv"].collapsedSize
        }, 250, function(){
          GUIvars["#navDiv"].expanded = false;
          GUIvars["#navDiv"].expanding = false;
        });
      }
    }
  };
  $("#navDiv").mouseover(function(){
    toggleNavDiv();
  });
  $("#navDiv").mouseout(function(){
    toggleNavDiv();
  });


  var toggleFriendsDiv = function(){
    if(!GUIvars["#friendsDiv"].expanding){
      GUIvars["#friendsDiv"].expanding = true;
      if(!GUIvars["#friendsDiv"].expanded){
        $("#friendsDiv").animate({
          width: GUIvars["#friendsDiv"].expandedSize,
          left: GUIvars["#friendsDiv"].expandedLeft
        }, 250, function(){
          GUIvars["#friendsDiv"].expanded = true;
          GUIvars["#friendsDiv"].expanding = false;
        });
      }
      else{
        $("#friendsDiv").animate({
          width: GUIvars["#friendsDiv"].collapsedSize,
          left: GUIvars["#friendsDiv"].collapsedLeft
        }, 250, function(){
          GUIvars["#friendsDiv"].expanded = false;
          GUIvars["#friendsDiv"].expanding = false;
        });
      }
    }
  };
  $("#friendsDiv").mouseover(function(){
    toggleFriendsDiv();
  });
  $("#friendsDiv").mouseout(function(){
    toggleFriendsDiv();
  });


  var toggleChatWindow = function(){
    if(!GUIvars["#gameChatDiv"].expanding){
      GUIvars["#gameChatDiv"].expanding = true;
      if(GUIvars["#gameChatDiv"].expanded){
        $("#gameChatDiv").animate({opacity: 0}, 500, function(){
          GUIvars["#gameChatDiv"].expanded = false;
          GUIvars["#gameChatDiv"].expanding = false;
        });
      }
      else{
        $("#gameChatDiv").animate({opacity: 1}, 500, function(){
          GUIvars["#gameChatDiv"].expanded = true;
          GUIvars["#gameChatDiv"].expanding = false;
        });
      }
    }
  };
  $("#minGameChatDiv").click(function(){
    toggleChatWindow();
  });
  $("#minGameChatDiv").mouseover(function(){
    $("#minGameChatDiv").css({
      "background-color": GUIvars["#minGameChatDiv"].mouseoverColor
    });
  });
  $("#minGameChatDiv").mouseout(function(){
    $("#minGameChatDiv").css({
      "background-color": GUIvars["#minGameChatDiv"].mouseoutColor
    });
  });

  $(window).resize(function(){
    $("#navDiv").css("height", window.innerHeight);
    $("#friendsDiv").css("height", window.innerHeight);
  });

  document.onkeydown = function(e){
    //C
    if(e.which === 67){
      toggleChatWindow();
    }
  };

});