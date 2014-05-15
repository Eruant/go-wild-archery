var Phaser = require('phaser'),
  game = require('../game'),
  language = require('../lang');

module.exports = {

  create: function () {

    var tween,
      style = {
        font: '20px Arial',
        fill: '#fff',
        align: 'center'
      };

    this.background = this.add.sprite(0, 0, 'menu_background');
    this.background.alpha = 0;

    this.labelTitle = game.add.text(game.width / 2, game.height / 2, language[game.language].mainMenu.labelTitle, style);
    this.labelTitle.alpha = 0;
    this.labelTitle.anchor.setTo(0.5, 0.5);

    tween = this.add.tween(this.background)
      .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    this.add.tween(this.labelTitle)
      .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

    tween.onComplete.add(this.addPointerEvents, this);
  },

  addPointerEvents: function () {
    //this.startGame();
    this.input.onDown.addOnce(this.startGame, this);
  },

  startGame: function () {
    game.state.start('level1', true, false);
  }

};
