var game = require('../game'),
  Arrow = require('../classes/Arrow');

function Bow() {

  this.SHOT_DELAY = 250;
  this.ARROW_SPEED = 500;
  this.NUMBER_OF_ARROWS = 5;
  
  var i, arrow;

  this.sprite = game.add.sprite(50, game.height / 2, 'bow');
  this.sprite.anchor.setTo(1, 0.5);

  this.arrowPool = game.add.group();
  for (i = 0; i < this.NUMBER_OF_ARROWS; i++) {
    arrow = new Arrow();
    this.arrowPool.add(arrow.sprite);
  }

  game.input.activePointer.x = game.width / 2;
  game.input.activePointer.y = game.height / 2;

  game.time.advancedTiming = true;
}

Bow.prototype.shoot = function () {

  if (this.lastArrowShotAt === undefined) {
    this.lastArrowShotAt = 0;
  }

  if (game.time.now - this.lastArrowShotAt < this.SHOT_DELAY) {
    return;
  }
  this.lastArrowShotAt = game.time.now;

  var arrow = this.arrowPool.getFirstDead();

  if (arrow === null || arrow === undefined) {
    return;
  }

  arrow.revive();

  arrow.checkWorldBounds = true;
  arrow.outOfBoundsKill = true;

  arrow.reset(this.sprite.x, this.sprite.y);
  arrow.rotation = this.sprite.rotation;

  arrow.body.velocity.x = Math.cos(arrow.rotation) * this.ARROW_SPEED;
  arrow.body.velocity.y = Math.sin(arrow.rotation) * this.ARROW_SPEED;
};

Bow.prototype.update = function () {
  if (game.input.activePointer.isDown) {
    this.shoot();
  }

  this.sprite.rotation = game.physics.arcade.angleToPointer(this.sprite);
};

module.exports = Bow;
