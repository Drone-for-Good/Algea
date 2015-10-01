// The Game State runs the game
(function() {
  'use strict';

  var WORLD_WIDTH = 4096;
  var WORLD_HEIGHT = 2048;

  function Game() {}

  Game.prototype = {
    preload: function() {
      //set up world so coordinate (0,0) is the center
      this.world.setBounds(-WORLD_WIDTH/2, -WORLD_HEIGHT/2, WORLD_WIDTH,  WORLD_HEIGHT);

      this.camera.bounds = null;

      // Set up keyboard cursor keys so they can be used
      this.cursors = this.input.keyboard.createCursorKeys();

      this.score = 10;
    },

    create: function () {
      //worldGroup is a group is used for zooming out.
      //Add all objects that are part of the world, except the player, to this group.
      //E.g. Enemies, food, not score or leaderboard.
      this.worldGroup = this.add.group();

      var background = createBackground(this.game);
      this.worldGroup.add(background);

      this.walls = this.add.group(this.worldGroup);
      this.walls.addMultiple( createWalls(this.game) );

      //For testing. Server will have to handle where to place food
      this.food = this.add.group(this.worldGroup);
      this.food.enableBody = true;
      for (var i = 0; i < 60; i++) {
        this.food.create(this.world.randomX, this.world.randomY, 'food');
      }

      // Create the player group, which is an array
      this.playerCells = this.add.group();

      // Create the primary player cell
      this.player = this.initializePlayer(50, 0, 0);
      this.player.old = true;
      this.playerCells.add(this.player);
      this.camera.follow(this.player);

      this.scoreText = this.add.text(20, this.game.height - 52,
        'score: 0', { fontSize: '32px', fill: '#000' });
      this.scoreText.fixedToCamera = true;

      // Spacebar splits the player
      var spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spacebar.onDown.add(function(key) {
        this.split();
        console.log(this.player);
      }, this);

      // For testing: down key console logs info
      var downkey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      downkey.onDown.add(function(key) {
        console.log(playerCells);
      }, this);

      // For testing: left key calls getPlayerState
      var leftkey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      leftkey.onDown.add(function(key) {
        this.getPlayerState();
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

      this.playerCells.forEach(function(cell) {
        // Only split if cell is not a newly split cell
        if (cell.old) {
          // Halve the mass of the original cell
          cell.width = cell.width / Math.sqrt(2);
          cell.height = cell.height / Math.sqrt(2);

          // Make new cell appear 30 px from the top right corner of the group
          var newRadius = cell.width / 2;
          var newX = this.getPlayerCellsRight(this.playerCells) + newRadius + 30;
          var newY = this.getPlayerCellsTop(this.playerCells) - newRadius - 30;
          var newCell = this.initializePlayer( newRadius, newX, newY);
          this.playerCells.add(newCell);
        }
      }, this);

      // Set flag of all cells to "old"
      this.playerCells.forEach(function(cell) {
        if (!cell.old) {
          cell.old = true;
        }
      });
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

    // Update function is called by the core game loop every frame
    update: function () {

      var player = this.player;

      // Update each child
      this.playerCells.forEach(function(cell) {
        this.physics.arcade.collide(cell, this.walls);
        this.physics.arcade.overlap(cell, this.food, this.eatFood, null, this);
        this.physics.arcade.collide(cell, this.playerCells);

        // 30 is arbitrary number so that cells with larger mass move more slowly
        var dist = this.physics.arcade.distanceToPointer(cell) * 30/cell.width;
        this.physics.arcade.moveToPointer(cell, dist);
      }, this);

      //This is for testing
      if (this.cursors.up.isDown){
        this.scalePlayer(player);
        this.zoomOut();
      }
    },

    // Show debug info
    render: function() {
      this.game.debug.cameraInfo(this.camera, 32, 32, 'black');
      this.playerCells.forEach(function(cell) {
        var i = this.playerCells.getIndex(cell);
        this.game.debug.spriteCoords(cell, 32, 120+100*i, 'black');
     }, this);
    },

    eatFood: function(player, food) {
      food.kill();

      this.score += 10;
      this.scoreText.text = 'Score: ' + this.score;

      this.scalePlayer(this.player, this.score);
      this.zoomOut();
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
      player.scale.setTo(player.scale.x+0.002, player.scale.y+0.002);
    },

    win: function() {
      // We start the win state
      this.game.state.start('win');
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
    }
  };

  window['agar'] = window['agar'] || {};
  window['agar'].Game = Game;
}());
