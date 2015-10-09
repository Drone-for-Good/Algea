// Preloader State loads the assets
(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {
    preload: function () {
      // Render the loading bar image
      this.asset = this.add.sprite(this.game.width * 0.5 - 110,
        this.game.height * 0.5 - 10, 'preloader');
      this.load.setPreloadSprite(this.asset);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.loadResources();

      // this.ready = true;
    },

    loadResources: function () {
      // load your assets here
      //this.load.image('grid', 'assets/black.png');
      this.load.image('grid', 'assets/starBackground.jpg');
      this.load.image('player', 'assets/epcotSpaceshuttle.png');
      this.load.image('virus', 'assets/smaller_blackHole.png');

      //All the planet food images
      this.load.image('food0', 'assets/small_mercury.png');
      this.load.image('food1', 'assets/earth.png');
      this.load.image('food2', 'assets/venus.png');
      this.load.image('food3', 'assets/mars.png');
      this.load.image('food4', 'assets/neptune.png');
      this.load.image('food5', 'assets/jupiter.png');
      //this.load.image('food6', 'assets/sun.pdf');

    },

    create: function () {

    },

    update: function () {
      if (!!this.ready) {
        // Launch the Menu State
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['agar'] = window['agar'] || {};
  window['agar'].Preloader = Preloader;
}());
