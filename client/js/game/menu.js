// Menu state displays the pre-game menu
(function() {
  'use strict';

  function Menu() {}

  Menu.prototype = {
    create: function () {
      var background = this.add.tileSprite(0,0, 4096, 2048, 'grid');
      background.anchor.setTo(0.5, 0.5);

      var centerX = this.game.width * 0.5;
      var centerY = this.game.height * 0.5;
      var titleText = 'Agar';
      var subheaderText = 'Login and join a room to begin playing';

      var title = this.add.text(centerX, centerY - 50, titleText,
        {font: '42px Arial', fill: '#000', align: 'center'} );
      title.anchor.set(0.5);

      var subheader = this.add.text(centerX, centerY, subheaderText,
        {font: '30px Arial', fill: '#000', align: 'center'} );
      subheader.anchor.set(0.5);

      // When mouse is clicked
      this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
      // Launch the Game State when user clicks mouse
      this.game.state.start('game');
    }
  };

  window['agar'] = window['agar'] || {};
  window['agar'].Menu = Menu;
}());
