var Phaser = require('phaser'),
  game = require('../game');

/**
 * @class Arrows
 * @param {Number} arrowCount
 */
function Arrows(arrowCount) {

  // constants
  this.SHOT_DELAY = 250;
  this.NUMBER_OF_ARROWS = arrowCount || 5;

  // variables
  var i;

  // add new group and fill with arrows
  this.arrows = game.add.group();
  for (i = 0; i < this.NUMBER_OF_ARROWS; i++) {
    this.addArrow();
  }

  // ensure that we are using advanced timeing
  game.time.advancedTiming = true;

}

/**
 * @method addArrow
 */
Arrows.prototype.addArrow = function () {

  // add the sprite
  var arrow = game.add.sprite(0, 0, 'arrow');
  arrow.anchor.setTo(0.5, 0.5);

  // add phyics to the sprite
  game.physics.enable(arrow, Phaser.Physics.ARCADE);

  // start it in a dead mode
  arrow.kill();

  // add it to the pool
  this.arrows.add(arrow);
};

/**
 * @method shoot
 * @param {Number} x
 * @param {Number} y
 * @param {Number} rotation
 */
Arrows.prototype.shoot = function (x, y, rotation, speed) {

  // check to see if this is the first arrow shot
  if (this.lastArrowShotAt === undefined) {
    this.lastArrowShotAt = 0;
  }

  // test to see if we are allowed to shoot
  if (game.time.now - this.lastArrowShotAt < this.SHOT_DELAY) {
    return;
  }
  this.lastArrowShotAt = game.time.now;

  // request a dead arrow
  var arrow = this.arrows.getFirstDead();

  // check that we have an arrow
  if (arrow === null || arrow === undefined) {
    return;
  }

  // reset the arrow
  arrow.revive();
  arrow.checkWorldBounds = true;
  arrow.outOfBoundsKill = true;
  arrow.reset(x, y);

  // add a direction and speed
  arrow.body.velocity.x = Math.cos(rotation) * speed;
  arrow.body.velocity.y = Math.sin(rotation) * speed;
};

/**
 * @method update
 */
Arrows.prototype.update = function () {

  // cycle all alive arrows and update there position
  this.arrows.forEachAlive(function (arrow) {
    arrow.rotation = Math.atan2(arrow.body.velocity.y, arrow.body.velocity.x);
  }, this);
};

module.exports = Arrows;
