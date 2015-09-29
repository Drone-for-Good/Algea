(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {
    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
      this.load.setPreloadSprite(this.asset);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.loadResources();

      // this.ready = true;
    },

    loadResources: function () {
      // load your assets here
      this.load.image('grid', 'assets/grid.jpg');
      this.load.image('food', 'assets/star.png');
    },

    create: function () {

    },

    update: function () {
      if (!!this.ready) {
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
