window.addEventListener('load', function () {
  'use strict';

  

  var ns = window['agar'];

  // 'agar-game' is id of DOM element that the canvas element is inserted into
  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameDiv');

  // game.state is a Phaser State Manager that adds various game states
  // StateManager: http://phaser.io/docs/2.4.3/Phaser.Game.html#state
  // State: http://phaser.io/docs/2.4.3/Phaser.State.html
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */

  // Launch the Boot State
  game.state.start('boot');
  window.agar.game = game;
}, false);
