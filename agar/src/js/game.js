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

      this.cursors = this.input.keyboard.createCursorKeys();

      this.score = 10;
    },
    create: function () {
      //This group is used for zooming out.
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

      this.player = initializePlayer(this.game);
      this.camera.follow(this.player);
      
      this.scoreText = this.add.text(20, this.game.height - 52, 'score: 0', { fontSize: '32px', fill: '#000' });
      this.scoreText.fixedToCamera = true;

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

      function initializePlayer (game){
        var radius = 50;
        var circle = game.add.bitmapData(radius*2, radius*2).circle(radius, radius, radius, '#0000FF');
        var player = game.add.sprite(0, 0, circle);
        player.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;

        //All physics bodies are rectangles when using Arcade Physics.
        //By default, the rectangle will enclose the player circle
        //The lines below resize the body so the circle encloses the physics body.
        var hitboxWidth = radius*2 / 1.414;
        player.body.setSize(hitboxWidth, hitboxWidth);
        return player;
      }
    },

    update: function () {
      var player = this.player;

      this.physics.arcade.collide(player, this.walls);
      this.physics.arcade.overlap(player, this.food, this.eatFood, null, this);

      var dist = this.physics.arcade.distanceToPointer(player);
      this.physics.arcade.moveToPointer(player, dist);
    
      //This is for testing
      if (this.cursors.up.isDown){
        this.scalePlayer(player);
        this.zoomOut();
      }
    },
    render: function() {
      this.game.debug.cameraInfo(this.camera, 32, 32, 'black');
      this.game.debug.spriteCoords(this.player, 32, 500, 'black');
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
    }
  };

  window['agar'] = window['agar'] || {};
  window['agar'].Game = Game;
}());
