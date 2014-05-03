var game = require('../game'),
  Arrow = require('../classes/Arrow');

function Bow() {

  this.SHOT_DELAY = 1000;
  this.ARROW_SPEED = 500;
  this.NUMBER_OF_ARROWS = 1;
  
  var i, arrow;

  this.sprite = game.add.sprite(50, game.height / 2, 'bow');
  this.sprite.anchor.setTo(1, 0.5);

  this.arrowPool = game.add.group();
  for (i = 0; i < this.NUMBER_OF_ARROWS; i++) {
    arrow = new Arrow();
    this.arrowPool.add(arrow.sprite);
  }

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

  arrow.body.velocity.x = this.ARROW_SPEED;
  arrow.body.velocity.y = 0;
};

module.exports = Bow;
