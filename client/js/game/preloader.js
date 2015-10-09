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
      this.load.image('grid', 'assets/black.png');
      this.load.image('food', 'assets/small_mercury.png');
      this.load.image('player', 'assets/epcotSpaceshuttle.png');
      this.load.image('virus', 'assets/smaller_blackHole.png');

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
