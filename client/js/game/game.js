// The Game State runs the game
(function() {
  'use strict';

  var WORLD_WIDTH = 4096;
  var WORLD_HEIGHT = 2048;

  var count = 0;
  var countZoom = 0;
  var mergeCount = 0;


  function Game() {}

  Game.prototype = {
    init: function (username, roomName, foodInfo, virusInfo) {
      this.username = username;
      this.roomName = roomName;
      this.initialFoodData = foodInfo;
      this.lifetime = 0;


      //TODO: add the virus here, too:
      //this.initialVirusData = virusInfo;
      //hard coding in virus data.
      this.initialVirusData = {
        0: { id: 0, x: 500, y: 700 },
        1: { id: 1, x: -1300, y: 800 },
        2: { id: 2, x: 0, y: -600 },
        4: { id: 3, x: 1400, y: 100 }
      }

      // For testing
      // this.initialFoodData = {
      //   0: { id: 0, x: 100, y: 100, color: '#ffffe0' },
      //   1: { id: 1, x: -100, y: -100, color: '#ffffe0' },
      //   2: { id: 1, x: -100, y: -100, color: '#ffffe0' }
      // };
    },

    preload: function () {
      // Set up world so coordinate (0,0) is the center
      this.world.setBounds(-WORLD_WIDTH/2, -WORLD_HEIGHT/2,
        WORLD_WIDTH,  WORLD_HEIGHT);

      this.camera.bounds = null;

      // Set up keyboard cursor keys so they can be used
      this.cursors = this.input.keyboard.createCursorKeys();

      this.score = 25;
    },

    create: function () {

      // Reference to all current food objects, for easy removal
      // Example: { 12: reference, 13: reference };
      this.foodIDs = {};

      // List of all foods player has eaten since the last
      // update sent to server
      this.eatenFoodIDs = [];

      //TODO: reference to all current virus objects

      this.virusIDs = {};
      this.eatenVirusIDs = [];

      // worldGroup is a group is used for zooming out.
      // Add all objects that are part of the world,
      // except the player, to this group.
      // E.g. Enemies, food, not score or leaderboard.
      this.worldGroup = this.add.group();
      this.worldGroup.setAll("scale.x", (this.worldGroup.scale.x - this.worldGroup.scale.x * .5));
      this.worldGroup.setAll("scale.y", (this.worldGroup.scale.y - this.worldGroup.scale.y * .5));
      //this.worldGroup.scale.x -= this.worldGroup.scale.x * .5;
      //this.worldGroup.scale.y -= this.worldGroup.scale.y * .5;

      var background = createBackground(this.game);
      this.worldGroup.add(background);

      this.walls = this.add.group(this.worldGroup);
      this.walls.addMultiple( createWalls(this.game) );

      // Create food group
      this.food = this.add.group(this.worldGroup);
      this.food.enableBody = true;

      // Add all the initial food
      for (var key in this.initialFoodData) {
        this.addFood(this.initialFoodData[key]);
      }


      // For testing
      // for (var i = 0; i < 60; i++) {
      //   this.food.create(this.world.randomX,
      //      this.world.randomY, 'food');
      // }

      //TODO: Create virus here
      this.virus = this.add.group(this.worldGroup);
      this.virus.enableBody = true;

      //Now add all the initial viruses to the screen
      for (var key in this.initialVirusData) {
        this.addVirus(this.initialVirusData[key]);
      }

      // All the other players
      this.enemies = this.add.group(this.worldGroup);

      // Hold reference to each enemy group. Key is the username of the player
      this.enemyNames = {};


      // Create the player group, which is an array
      this.playerCells = this.add.group();

      // Create the primary player cell
      this.player = this.initializePlayer(30, 0, 0, this.username);
      this.playerCells.add(this.player);

      this.scoreText = this.add.text(20, this.game.height - 52,
        'score: 0', { fontSize: '32px', fill: '#000' });
      this.scoreText.fixedToCamera = true;

      window.playerUpdateRoutine
        = setInterval(this.sendPlayerState.bind(this), 17);
      window.globalSocket.on('receiveFromServerGameState',
        this.processGameStateData.bind(this));

      // Spacebar splits the player
      var spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spacebar.onDown.add(function(key) {
        this.split();

      }, this);

      // For testing: down key console logs info
      var downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      downKey.onDown.add(function(key) {
        // Change the enemies
        //console.log(this.enemies, "Enemies")
        if(this.playerCells.children[1]){
          //console.log(this.playerCells.children[1])
          this.eat(this.playerCells.children[0], this.playerCells.children[1])
        }
        //this.processGameStateDataTEST();
      }, this);

      // For testing:
      var leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(function(key) {
          console.log("enemy group objects: ", this.enemies);
          console.log("enemy names: ", this.enemyNames);
      }, this);

      // For testing: up key scales the player
      var upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
      upKey.onDown.add(function(key) {
        this.playerCells.forEachAlive(function (cell) {
          var massIncrease = 100;
          cell.mass += massIncrease;
          this.scalePlayer(cell, cell.mass) //* (1-(massIncrease/1000)));
        
        }, this);
      }, this);

      function createBackground (game) {
        var background
          = game.add.tileSprite(0,0, 4096 * 2, 2048 * 2, 'grid');
        background.anchor.setTo(0.5, 0.5);
        return background;
      }

      //TODO: change wall dimensions, make permeable.
      function createWalls (game) {
        var WALL_THICKNESS = 5;

        var horizontalWall = game.make.bitmapData(game.world.width,

          WALL_THICKNESS).fill(128, 128, 128);
        var verticalWall = game.make.bitmapData(WALL_THICKNESS,
          game.world.height).fill(128, 128, 128);

        var walls = game.add.group();
        walls.enableBody = true;

        var leftX = game.world.x;
        var rightX = -game.world.x;
        var topY = game.world.y;
        var bottomY = -game.world.y;

        walls.create(leftX, topY, horizontalWall);
        walls.create(leftX, topY, verticalWall);
        walls.create(leftX, bottomY, horizontalWall);
        walls.create(rightX, topY, verticalWall);

        walls.setAll('body.immovable' , true);
        walls.setAll('body.moves' , false);
        walls.setAll('body.bounce', 0);
        walls.setAll('collideWorldBounds', true);
        //this.ground.physicsType = Phaser.SPRITE;
        return walls;
      }
    },

    initializePlayer: function (radius, x, y, username) {
      //FIXIT
      var playerPic = this.game.add.image(0, 0, 'player');
      playerPic.width = radius * 2 + 25;
      playerPic.height = radius * 2 + 25;
      var circle = this.game.add.bitmapData(radius * 2, radius * 2)
         .circle(radius, radius, radius, '#0000FF');
      var player = this.game.add.sprite(x, y, circle); //this.game.add.sprite(x, y, 'player');
      player.mass = Math.pow(radius*2, 2)/100;

      this.scalePlayer(player, player.mass);// * (1 + countZoom)); //cell.mass * (1 + massLost/1000)
      player.anchor.setTo(0.5, 0.5);

      this.game.physics.arcade.enable(player);
      player.body.collideWorldBounds = true;

      var style = { font: "30px Arial", fill: "#ffffff" };
      var text = this.game.add.text(0, 0, username, style);
      playerPic.anchor.setTo(0.5, 0.5);
      text.anchor.setTo(0.5, 0.5);
      player.addChild(text);
      player.addChild(playerPic);



      // All physics bodies are rectangles when using Arcade Physics.
      // By default, the rectangle will enclose the player circle
      // The lines below resize the body so the circle
      // encloses the physics body.
      // Turned off because not optimal for splitting
      // var hitboxWidth = radius*2 / 1.414;
      // player.body.setSize(hitboxWidth, hitboxWidth);
      return player;
    },

    massToRadius: function(mass, radius){
      if(radius){
        return Math.pow(radius*2, 2)/100;
      }
      return Math.pow(mass*100, .5)/2;
    },

    // Split all existing player cells
    // TODO:  Bug: sometimes new cells
    //        get stuck outside of the world
    split: function () {

      var originalCellCount = this.playerCells.length;
      var count = 0;

      this.playerCells.forEach(function (cell) {
        // Only split if cell is not a newly split cell
        if (count < originalCellCount && cell.width > 141) {
          // Halve the mass of the original cell

          cell.mass = cell.mass/2;
          cell.width = this.massToWidth(cell.mass);
          cell.height = cell.width;

          // Make new cell appear 30 px from the top right corner
          // of the group
          var newRadius = cell.width / 2;
          var newCell = this.initializePlayer(newRadius, cell.x, cell.y,
                          this.username);
          this.playerCells.add(newCell);

          var velocity= {};
          velocity.x = cell.body.velocity.x > 0 ?
                          cell.body.velocity.x + 600:
                          cell.body.velocity.x - 600;
          velocity.y = cell.body.velocity.y > 0 ?
                          cell.body.velocity.y + 600:
                          cell.body.velocity.y - 600;
          newCell.body.velocity = velocity;

          newCell.body.checkCollision.none = true;
          var split = this.game.add.tween(newCell.body.velocity);
          split.to({x: 0, y: 0}, 1000, Phaser.Easing.Cubic.In);
          split.onComplete.add(function () {
            newCell.body.checkCollision.none = false;
          }, this);
          split.start();
          count++;
        }
      }, this);
    },

    // Get the x coordinate of the right boundary
    // of the player cells group
    getPlayerCellsRight: function (playerCells) {
      var right;
      playerCells.forEach(function (cell) {
        if (!right) {
          right = cell.x + cell.width / 2;
        } else {
          if (right < cell.x + cell.width / 2) {
            right = cell.x + cell.width / 2
          }
        }
      }, this);
      return right;
    },

    // Get the y coordinate of the top boundary
    // of the player cells group
    getPlayerCellsTop: function () {
      var top;
      this.playerCells.forEach(function (cell) {
        if(!top) {
          top = cell.y - cell.height / 2;
        } else {
          if (top > cell.y + cell.height / 2) {
            top = cell.y + cell.height / 2;
          }
        }
      }, this);
      return top;
    },

    // Called by game loop to update rendering of objects
    update: function () {
      //counter used to determine when to decrease the size of the player
      if (count > 3000){
        count = 0;
      }

      count += 50;

      // Update location of every player cell and decrease size on interval

      this.playerCells.forEach(function (cell) {
        if(count >= 3000){
          var context = this;
          var massLost = .0000055555 * cell.mass * cell.mass - 0.00055555 * cell.mass;//Math.floor(.0000055555 * cell.mass * cell.mass - 0.00055555 * cell.mass);//0.0001*cell.mass*cell.mass);
          cell.mass -= massLost;
          this.scalePlayer(cell, cell.mass)// * (1 + massLost/1000));

        }

        var dist = this.physics.arcade.distanceToPointer(cell);
        // Weird math so you dont have to move the
        // cursor to the edge of the window to
        // reach max speed
        // Also scales max speed with area rather
        // than radius/diameter
        var velocity
          = Math.min(dist * 5, 70000 / cell.mass);
        this.physics.arcade.moveToPointer(cell, velocity);
      }, this);


      // Check for collisions

      //TODO: modify wall to allow players to pass back and forth
      //this.physics.arcade.collide(this.playerCells, this.walls);
      // Food collisions
      this.physics.arcade.overlap(this.playerCells,
        this.food, this.eatFood, null, this);

        //TODO check for virus collisions
      this.physics.arcade.overlap(this.playerCells,
        this.virus, this.eatVirus, null, this);

      this.enemies.forEachAlive(function (enemy) {
        this.physics.arcade.overlap(this.playerCells,
          enemy, this.eatOrBeEaten, null, this);
      }, this);

      this.physics.arcade.collide(this.playerCells,
        this.playerCells);

      //Rectangle that bounds all player cells
      var boundingRect = this.playerCells.getLocalBounds();
      this.camera.focusOnXY(boundingRect.centerX, boundingRect.centerY);
      this.lifetime = this.lifetime + .01;

      //remerge cells after time
      if(this.playerCells.children.length > 1){
        mergeCount += 50
        if(mergeCount > 100000){
          this.eat(this.playerCells.children[0], this.playerCells.children[1]);
          mergeCount = 0;
        }
      }
    },

    // Show debug info
    render: function () {
      this.game.debug.cameraInfo(this.camera, 32, 32, 'black');
      this.playerCells.forEach(function (cell) {
        var i = this.playerCells.getIndex(cell);
        this.game.debug.spriteCoords(cell, 32, 120 + 100 * i, 'black');
     }, this);
    },

    eatFood: function (playerCell, food) {
      // foodPlayerAte will be send to server at interval

      var totalMass = 0;
      var num = 0;
      this.playerCells.forEachAlive(function (cell) {
          totalMass += cell.mass;
          num++;
      }, this);
      num = 0;
      //console.log(totalMass,"totalMass")

      this.eatenFoodIDs.push(food.id);
      // this.foodIDs[food.id] = null;
      // food.destroy();
      this.removeFood(food.id);

      this.score += 5;
      this.scoreText.text = 'Score: ' + this.score;

      if(totalMass < 1000){
        var massIncrease = 10;
        var context = this;

        playerCell.mass += massIncrease;

        this.scalePlayer(playerCell, playerCell.mass);// * (1 - (massIncrease/1000)));
    
      }

    },


    eatOrBeEaten: function (mainPlayerCell, cellB) {
      if (cellB.mass * 0.8 > mainPlayerCell.mass) {
        this.eat(mainPlayerCell, cellB)
      }
    },

    eatVirus: function(playerCell, virus) {
      //virusPlayerAte will be sent to the server at interval
      this.eatenVirusIDs.push(virus.id);
      this.removeVirus(virus.id);

      this.score -=100;
      this.scoreText.text = 'Score' + this.score;
      if(playerCell.mass < 10) {
        playerCell.mass = playerCell.mass * 0.75;
        this.scalePlayer(playerCell, playerCell.mass);
      } else {
        playerCell.mass = playerCell.mass * 0.5;
        this.scalePlayer(playerCell, playerCell.mass);
      }



      //copied from below - have to reset the game if playerCell is destroyed
      // if (this.playerCells.length === 0){
      //   clearInterval(window.playerUpdateRoutine);
      //   //TODO: Allow user to continue playing in same room
      //   //Currently user will have to rejoin room after dying
      //   this.game.state.start('menu');
      // }
    },

    eat: function(cellA, cellB){
      
      var mass = cellA.mass;
      var cellBName = cellB.parent.username;
      var cellIndex = cellB.parent.getChildIndex(cellB);

      var data = {
        username: cellBName,
        cellIndex: cellIndex,
        mass: mass
      };

      cellB.mass += cellA.mass;
      window.globalSocket.emit('sendToServerCellEaten', data);
      cellA.destroy();

      if (this.playerCells.length === 0){
        clearInterval(window.playerUpdateRoutine);
        //TODO: Allow user to continue playing in same room
        //Currently user will have to rejoin room after dying
        this.game.state.start('menu');
      }
    },


    zoom: function(massIncrease){
      if(countZoom < 1.25 && countZoom >= 0){
        var world = this.worldGroup;
        var scaleRate = massIncrease/1000;
        countZoom += scaleRate;

        if (countZoom < 0){
          countZoom = 0;
          scaleRate = scaleRate + countZoom;
        }

        world.scale.x -= world.scale.x * scaleRate;
        world.scale.y -= world.scale.y * scaleRate;

        this.playerCells.forEachAlive(function (cell) {
          cell.x -= cell.x * scaleRate;
          cell.y -= cell.y * scaleRate;
        }, this);
      }
    },


    scalePlayer: function (player, mass, modifier) {
      //TODO: check for collisions?
      player.width = this.massToWidth(mass);
      player.height = player.width;
    },

    win: function () {
      // We start the win state
      this.game.state.start('win');
    },

    addFood: function (foodData) {
      // Render the new food object
      var newFood = this.food.create(foodData.x, foodData.y, 'food');
      newFood.id = foodData.id;
      // If there is still food currently with the same id, destroy it
      if (this.foodIDs[foodData.id]) {
        //console.log('food is already there');
        this.removeFood(foodData.id);
      }
      // Add reference to newFood object to foodIDs
      this.foodIDs[foodData.id] = newFood;
    },

    removeFood: function (id) {
      // If the food still exists
      if (this.foodIDs[id]) {
        // delete the object
        this.foodIDs[id].destroy();
        // Update the foodIDs
        this.foodIDs[id] = null;
      }
    },

    //TODO: addVirus here
    addVirus: function(virusData) {
      //render new virus
      var newVirus = this.virus.create(virusData.x, virusData.y, 'virus');
      newVirus.id = virusData.id;
      //if there is still a virus with the same id, destroy it
      if(this.virusIDs[virusData.id]) {
        console.log('virus is already there');
        this.removeVirus(virusData.id);
      }
      //Add reference to newVirus object to virusIDs
      this.virusIDs[virusData.id] = newVirus;
    },

    removeVirus: function(id) {
      //check if virus still exists
      //TODO: decide if this is necessary. If virus is consumed, will it go away?
      // if(this.virusIDs[id]) {
      //   //delete the virus
      //   this.virusIDs[id].destroy();
      //   //update virusIDs
      //   this.virusIDs[id] = null;
      // }
    },

    updateEnemyGroup: function(enemyGroup, data) {
      // Destroy all existing enemy cells
      enemyGroup.removeAll(true);
      // Re-draw all enemy cells with current data
      for (var i = 0; i < data.length; i++) {
        var newEnemyCell =
          this.initializePlayer(data[i].radius, data[i].x, data[i].y, enemyGroup.username);
        enemyGroup.add(newEnemyCell);
      // TODO: should we do collision detection here?
      }
    },

    // TODO: decide what info to send to server
    // TODO: call this function to send info to server
    getPlayerState: function () {
      var playerState = {};
      playerState.score = this.score;
      playerState.cells = [];
      this.playerCells.forEach(function (cell) {
        playerState.cells.push({
          "x" : cell.x/this.worldGroup.scale.x,
          "y" : cell.y/this.worldGroup.scale.x,
          "radius" : cell.width / 2
        });
      }, this);
      return playerState;
    },

    //TODO: add virus data to sendToServerPlayerState
    sendPlayerState: function () {
      window.globalSocket.emit('sendToServerPlayerState', {
        roomName: this.roomName,
        username: this.username,
        positionAndRadius: this.getPlayerState(),
        eatenFoodIDs: this.eatenFoodIDs,
        eatenVirusIDs: this.eatenVirusIDs
      });
      this.eatenFoodIDs = [];
      this.eatenVirusIDs = [];
    },

    // TESTING ONLY. Press DOWN key to call this function,
    // which will render the new enemies based on the given data
    processGameStateDataTEST: function () {

      var data = {};

      data.playerInfo =
      {
        jiggly: {
          positionAndRadius: [
            { x: 0, y: 0, radius: 4 },
            { x: 50, y: 50, radius: 4 }],
          skin : '' }
      };

      // Process enemy data
      for (var username in data.playerInfo) {
        // Do not process own player's data
        if (username === this.username) {
          continue;
        }
        // Create an enemy group if it doesn't exist already
        if (!this.enemyNames.hasOwnProperty(username)) {
          // Add a new enemy group with username
          var newEnemyGroup = this.add.group(this.enemies);
          newEnemyGroup.username = username;

          // Map username of enemy group for easy access
          this.enemyNames[username] = newEnemyGroup;
        }

        var enemy = this.enemyNames[username];
        this.updateEnemyGroup(enemy, data.playerInfo[username].positionAndRadius.cells);
      }

      // Delete any enemy groups no longer sent by server
      for (var username in this.enemyNames) {
        if (!data.playerInfo.hasOwnProperty(username)) {
          this.enemyNames[username].destroy();
          delete this.enemyNames[username];
        }
      }
    },

    processGameStateData: function (data) {

      // Process enemy data
      for (var username in data.playerInfo) {
        // Do not process own player's data
        if (username === this.username) {
          continue;
        }
        // Create an enemy group if it doesn't exist already
        if (!this.enemyNames.hasOwnProperty(username)) {
          // Add a new enemy group with username
          var newEnemyGroup = this.add.group(this.enemies);
          newEnemyGroup.username = username;

          // Map username of enemy group for easy access
          this.enemyNames[username] = newEnemyGroup;
        }

        var enemy = this.enemyNames[username];
        this.updateEnemyGroup(enemy, data.playerInfo[username].positionAndRadius.cells);
      }

      // Delete any enemy groups no longer sent by server
      for (var username in this.enemyNames) {
        if (!data.playerInfo.hasOwnProperty(username)) {
          this.enemyNames[username].destroy();
          delete this.enemyNames[username];
        }
      }

      // Process new food data
      for (var i = 0; i < data.newFood.length; i++) {
        this.addFood(data.newFood[i]);
      }

      // Process eatenFood data
      for (var i = 0; i < data.eatenFood.length; i++) {
        this.removeFood[data.eatenFood[i]];
      }

      //TODO: process new virus data and eatenVirus data
      // for (var i = 0; i < data.newVirus.length; i++) {
      //   this.addVirus(data.newVirus[i]);
      // }
      //
      // for (var i = 0; i < data.eatenVirus.length; i++) {
      //   this.removeVirus[data.eatenVirus[i]];
      // }

    },

    massToWidth: function (mass) {
      return Math.sqrt((mass)*100);
    },

    shutdown: function () {
      clearInterval(window.playerUpdateRoutine);
      window.globalSocket.removeListener('receiveFromServerGameState',
        this.processGameStateData.bind(this));
      window.globalSocket.emit('sendToServerLeaveGame', {
        username: this.username,
        gameRoom: this.roomName
      });
      window.gameVars.roomName = null;
    }
  };

  window['agar'] = window['agar'] || {};
  window['agar'].Game = Game;
}());
