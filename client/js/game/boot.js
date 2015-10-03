// Boot State configures the stage size and scale
(function () {
  'use strict';

  function Boot() {}

  Boot.prototype = {
    preload: function () {
      // Load the loading bar image
      this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function () {
      // configure game
      this.game.input.maxPointers = 1;

      //TODO: Configure Scaling.
      if (this.game.device.desktop) {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.minWidth =  1024/2;
        this.game.scale.minHeight = 768/2;
        this.game.scale.maxWidth = 1024*2;
        this.game.scale.maxHeight = 768*2;
      } else {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.minWidth =  480;
        this.game.scale.minHeight = 260;
        this.game.scale.maxWidth = 640;
        this.game.scale.maxHeight = 480;
        this.game.scale.forceOrientation(true);
        this.game.scale.pageAlignHorizontally = true;
      }

      // Launch the Preloader State
      this.game.state.start('preloader');
    }
  };

  window['agar'] = window['agar'] || {};
  window['agar'].Boot = Boot;
}());
