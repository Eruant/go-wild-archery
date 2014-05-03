var Phaser = require('phaser'),
  game = require('../game');

function Arrow() {

  this.sprite = game.add.sprite(0, 0, 'arrow');
  this.sprite.anchor.setTo(0.5, 0.5);

  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  this.sprite.kill();
}

module.exports = Arrow;
