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
      var subheaderText = 'Press any key to continue';

      var title = this.add.text(centerX, centerY - 50, titleText, 
        {font: '42px Arial', fill: '#000', align: 'center'} );
      title.anchor.set(0.5);

      var subheader = this.add.text(centerX, centerY, subheaderText, 
        {font: '30px Arial', fill: '#000', align: 'center'} );
      subheader.anchor.set(0.5);

      this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
      this.game.state.start('game');
    }
  };

  window['agar'] = window['agar'] || {};
  window['agar'].Menu = Menu;
}());
