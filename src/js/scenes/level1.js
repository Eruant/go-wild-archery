var /*Phaser = require('phaser'),*/
  game = require('../game'),
  Bow = require('../classes/Bow');


module.exports = {

  create: function () {

    game.stage.backgroundColor = 0xccddff;

    this.bow = new Bow();
  },

  update: function () {
    if (game.input.activePointer.isDown) {
      this.bow.shoot();
    }
  },

  restartGame: function () {
    game.state.start('mainMenu');
  }

};
