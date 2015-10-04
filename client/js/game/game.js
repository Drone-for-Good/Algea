// The Game State runs the game
(function() {
  'use strict';

  var WORLD_WIDTH = 4096;
  var WORLD_HEIGHT = 2048;

  function Game() {}

  Game.prototype = {
    init: function (username, roomName, foodInfo) {
      this.username = username;
      this.roomName = roomName;
      this.initialFoodData = foodInfo;
      // For testing
      // this.initialFoodData = {
      //   0: { id: 0, x: 100, y: 100, color: '#ffffe0' },
      //   1: { id: 1, x: -100, y: -100, color: '#ffffe0' },
      //   2: { id: 1, x: -100, y: -100, color: '#ffffe0' }
      // };
    },

    preload: function() {
      //set up world so coordinate (0,0) is the center
      this.world.setBounds(-WORLD_WIDTH/2, -WORLD_HEIGHT/2, WORLD_WIDTH,  WORLD_HEIGHT);

      this.camera.bounds = null;

      // Set up keyboard cursor keys so they can be used
      this.cursors = this.input.keyboard.createCursorKeys();

      this.score = 10;
    },

    create: function () {

      // Updated when server sends updated info about all players
      this.enemiesData = {
        // jiggly: { x: 0, y: 0, radius: 40, created: false },
        // puff: { x: 50, y: 50, radius: 30, created: false }
      };

      // Reference to all current food objects, for easy removal
      // Example: { 12: reference, 13: reference };
      this.foodIDs = {};

      // List of all foods player has eaten since the last update sent to server
      this.eatenFoodIDs = [];

      //worldGroup is a group is used for zooming out.
      //Add all objects that are part of the world, except the player, to this group.
      //E.g. Enemies, food, not score or leaderboard.
      this.worldGroup = this.add.group();

      var background = createBackground(this.game);
      this.worldGroup.add(background);

      this.walls = this.add.group(this.worldGroup);
      this.walls.addMultiple( createWalls(this.game) );

      // Create food group
      this.food = this.add.group(this.worldGroup);
      this.food.enableBody = true;

      // Add all the initial food
      for(var key in this.initialFoodData){
        this.addFood(this.initialFoodData[key]);
      }

      // For testing
      // for (var i = 0; i < 60; i++) {
      //   this.food.create(this.world.randomX, this.world.randomY, 'food');
      // }

      // All the the other players
      this.enemies = this.add.group(this.worldGroup);

      // Create the player group, which is an array
      this.playerCells = this.add.group();

      // Create the primary player cell
      this.player = this.initializePlayer(50, 0, 0);
      this.playerCells.add(this.player);
      this.camera.follow(this.player);

      this.scoreText = this.add.text(20, this.game.height - 52,
        'score: 0', { fontSize: '32px', fill: '#000' });
      this.scoreText.fixedToCamera = true;

      window.playerUpdateRoutine = setInterval(this.sendPlayerState.bind(this), 17);
      window.globalSocket.on('receiveFromServerGameState', this.processGameStateData.bind(this));

      // Spacebar splits the player
      var spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spacebar.onDown.add(function(key) {
        this.split();
        console.log(this.player);
      }, this);

      // For testing: down key console logs info
      var downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      downKey.onDown.add(function(key) {
        console.log(this.enemies);
      }, this);

      // For testing:
      var leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(function(key) {
          this.enemiesData["jiggly"] = { x: -50, y: -50, radius: 15, created: true }
      }, this);

      // For testing: up key scales the player
      var upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
      upKey.onDown.add(function(key) {
        this.scalePlayer(this.player);
        this.zoomOut(0.1);
      }, this);

      function createBackground(game) {
        var background = game.add.tileSprite(0,0, 4096*2, 2048*2, 'grid');
        background.anchor.setTo(0.5, 0.5);
        return background;
      }

      function createWalls(game) {
        var WALL_THICKNESS = 10;

        var horizontalWall = game.make.bitmapData(game.world.width, WALL_THICKNESS).fill(255,0,0);
        var verticalWall = game.make.bitmapData(WALL_THICKNESS, game.world.height).fill(255,0,0);

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
        return walls;
      }
    },

    initializePlayer: function(radius, x, y){
      var circle = this.game.add.bitmapData(radius*2, radius*2).circle(radius,
        radius, radius, '#0000FF');
      var player = this.game.add.sprite(x, y, circle);
      player.anchor.setTo(0.5, 0.5);

      this.game.physics.arcade.enable(player);

      player.body.collideWorldBounds = true;

      //All physics bodies are rectangles when using Arcade Physics.
      //By default, the rectangle will enclose the player circle
      //The lines below resize the body so the circle encloses the physics body.
      // Turned off because not optimal for splitting
      // var hitboxWidth = radius*2 / 1.414;
      // player.body.setSize(hitboxWidth, hitboxWidth);
      return player;
    },

    // Split all existing player cells
    // TODO: merge cells back into 1 after a specified time. Do this by setting
    // the lifespan property to the cell
    // TODO: Bug: sometimes new cells get stuck outside of the world
    split: function(){

      var originalCellCount = this.playerCells.length;
      var count = 0;

      this.playerCells.forEach(function(cell) {
        // Only split if cell is not a newly split cell
        if (count < originalCellCount && cell.width > 100) {
          // Halve the mass of the original cell
          cell.width = cell.width / Math.sqrt(2);
          cell.height = cell.height / Math.sqrt(2);

          // Make new cell appear 30 px from the top right corner of the group
          var newRadius = cell.width / 2;
          var newX = this.getPlayerCellsRight(this.playerCells) + newRadius + 30;
          var newY = this.getPlayerCellsTop(this.playerCells) - newRadius - 30;
          var newCell = this.initializePlayer( newRadius, cell.x, cell.y);

          var newCell = this.initializePlayer( newRadius, newX, newY);
          this.playerCells.add(newCell);

          // var dist = this.physics.arcade.distanceToPointer(cell);
          // var split = this.game.add.tween(newCell.body);
          // split.to({x: newX, y: newY}, 500)
          // split.onComplete.add(function(){
          //   this.playerCells.add(newCell);
          //   this.game.physics.arcade.enable(newCell);
          // }, this);
          // split.start();
          //this.physics.arcade.moveToXY(newCell, newX, newY, 60, 500);
          count++;
        }
      }, this);
    },

    // Get the x coordinate of the right boundary of the player cells group
    getPlayerCellsRight: function(playerCells){
      var right;
      playerCells.forEach(function(cell) {
        if(!right) {
          right = cell.x + cell.width / 2;
        } else {
          if (right < cell.x + cell.width / 2) {
            right = cell.x + cell.width / 2
          }
        }
      }, this);
      return right;
    },

    // Get the y coordinate of the top boundary of the player cells group
    getPlayerCellsTop: function(){
      var top;
      this.playerCells.forEach(function(cell) {
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

      var player = this.player;

      // Update location of every player cell
      this.playerCells.forEach(function(cell) {
        var dist = this.physics.arcade.distanceToPointer(cell);
        //Weird math so you dont have to move the cursor to the edge of the window to reach max speed
        //Also scales max speed with area rather than radius/diameter
        var velocity = Math.min(dist*5, 5000000/Math.pow(cell.width,2));
        this.physics.arcade.moveToPointer(cell, velocity);
      }, this);

      // Render all enemies
      this.renderEnemies();

      // Check for collisions
      this.physics.arcade.collide(this.playerCells, this.walls);
      this.physics.arcade.overlap(this.playerCells, this.food, this.eatFood, null, this);
      // this.physics.arcade.overlap(this.playerCells, this.enemies, this.eatOrBeEaten, null, this);
      this.physics.arcade.collide(this.playerCells, this.playerCells);
    },

    // Show debug info
    render: function() {
      this.game.debug.cameraInfo(this.camera, 32, 32, 'black');
      this.playerCells.forEach(function(cell) {
        var i = this.playerCells.getIndex(cell);
        this.game.debug.spriteCoords(cell, 32, 120+100*i, 'black');
     }, this);
    },

    renderEnemies: function() {
      for (var username in this.enemiesData){
        var enemyData = this.enemiesData[username];
        // Create a new enemy object
        if (enemyData && !enemyData.created){
          var newEnemy = this.initializePlayer(enemyData.radius, enemyData.x, enemyData.y);
          newEnemy.username = username;
          enemyData.created = true;
          this.enemies.add(newEnemy);

        // Othewise, update enemy size and position
        } else {
          // Get the enemy object
          var enemyMatches = this.enemies.filter(function(enemy) {
            return enemy.username === username ? true : false;
          }, true);
          var enemy = enemyMatches.list[0];
          enemy.width = enemyData.radius * 2;
          enemy.height = enemyData.radius * 2;
          enemy.x = enemyData.x;
          enemy.y = enemyData.y;
        }
      }
    },

    eatFood: function(playerCell, food) {
      // foodPlayerAte will be send to server at interval
      this.eatenFoodIDs.push(food.id);
      // this.foodIDs[food.id] = null;
      // food.destroy();
      this.removeFood(food.id);

      this.score += 10;
      this.scoreText.text = 'Score: ' + this.score;

      this.scalePlayer(playerCell, this.score);
      this.zoomOut();
    },

    // Todo: need to remove enemeyData as well
    eatOrBeEaten: function(playerCell, enemyCell) {
      if(playerCell.width > enemyCell.width){
        enemyCell.destroy();

      } else if (enemyCell.width > playerCell.width) {
        playerCell.destroy();
        clearInterval(window.playerUpdateRoutine);
      }
    },

    zoomOut: function(scaleRate){
      var player = this.player;
      var world = this.worldGroup;

      scaleRate = scaleRate || 0.001;

      world.scale.x -= world.scale.x * scaleRate;
      world.scale.y -= world.scale.y * scaleRate;

      player.x -= player.x * scaleRate;
      player.y -= player.y * scaleRate;
    },

    scalePlayer: function(player, mass) {
      //TODO: Figure out how to scale player based on mass
      //TODO: check for collisions?
      player.scale.setTo(player.scale.x+0.1, player.scale.y+0.1);
    },

    win: function() {
      // We start the win state
      this.game.state.start('win');
    },

    addFood: function(foodData) {
      // Render the new food object
      var newFood = this.food.create(foodData.x, foodData.y, 'food');
      newFood.id = foodData.id;
      // If there is still food currently with the same id, destroy it
      if (this.foodIDs[foodData.id]) {
        console.log('food is already there');
        this.removeFood(foodData.id);
      }
      // Add reference to newFood object to foodIDs
      this.foodIDs[foodData.id] = newFood;
    },

    removeFood: function(id){
      // If the food still exists
      if (this.foodIDs[id]) {
        // delete the object
        this.foodIDs[id].destroy();
        // Update the foodIDs
        this.foodIDs[id] = null;
      }
    },

    // TODO: decide what info to send to server
    // TODO: call this function to send info to server
    getPlayerState: function() {
      var playerState = {};
      playerState.score = this.score;
      playerState.cells = [];
      this.playerCells.forEach(function(cell) {
        playerState.cells.push({
          "x" : cell.x,
          "y" : cell.y,
          "radius" : cell.width / 2
        });
      }, this);
      return playerState;
    },

    sendPlayerState: function() {
      window.globalSocket.emit('sendToServerPlayerState', {
        roomName: this.roomName,
        username: this.username,
        positionAndRadius: this.getPlayerState(),
        eatenFoodIDs: this.eatenFoodIDs
      });
      this.eatenFoodIDs = [];
    },

    processGameStateData: function(data) {
      //TODO: Handle multiple cells

      // Process enemy data
      for(var username in data.playerInfo){
        if(username === this.username) {
          continue;
        }
        if(this.enemiesData[username] && this.enemiesData[username].created){
          this.enemiesData[username] = data.playerInfo[username].positionAndRadius.cells[0];
          this.enemiesData[username].created = true;
        } else {
          this.enemiesData[username] = data.playerInfo[username].positionAndRadius.cells[0];
        }
      }

      // Process new food data
      for(var i = 0; i < data.newFood.length; i++){
        this.addFood(data.newFood[i]);
      }

      // Process eatenFood data
      for(var i = 0; i < data.eatenFood.length; i++){
        this.removeFood[data.eatenFood[i]];
      }
    }
  };

  window['agar'] = window['agar'] || {};
  window['agar'].Game = Game;
}());
