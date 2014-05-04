var game = require('../game'),
  Bow = require('../classes/Bow');

module.exports = {

  create: function () {
    game.stage.backgroundColor = 0xccddff;
    this.bow = new Bow();
  },

  update: function () {
    this.bow.update();
  },

  restartGame: function () {
    game.state.start('mainMenu');
  }

};
