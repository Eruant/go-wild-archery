var game = require('../game'),
  Arrows = require('../classes/Arrows');

/**
 * @class Bow
 */
function Bow() {

  // constants
  this.GRAVITY = 980;
  this.MAX_ARROW_SPEED = 700;

  this.currentArrowSpeed = 0;
  
  // add the bow sprite
  this.sprite = game.add.sprite(50, game.height / 2, 'bow');
  this.sprite.anchor.setTo(1, 0.5);

  // add a quiver of arrows
  this.arrows = new Arrows(5);

  // setup trajectory
  this.trajectory = game.add.bitmapData(game.width, game.height);
  this.trajectory.context.fillStyle = 'rgb(255, 255, 255)';
  this.trajectory.context.strokeStyle = 'rgb(255, 255, 255)';
  game.add.image(0, 0, this.trajectory);

  // set the gravity
  game.physics.arcade.gravity.y = this.GRAVITY;

  // set the initial mouse / touch position
  game.input.activePointer.x = game.width / 2;
  game.input.activePointer.y = game.height / 2;

}

/*
 * @method shoot
 */
Bow.prototype.shoot = function () {

  // we can change this later to vary the speed of the shots
  var speed = (this.currentArrowSpeed < this.MAX_ARROW_SPEED) ? this.currentArrowSpeed : this.MAX_ARROW_SPEED;

  // release an arrow
  this.arrows.shoot(this.sprite.x, this.sprite.y, this.sprite.rotation, speed);

  // reset power
  this.currentArrowSpeed = 0;
};

/*
 * @method drawTrajectory
 */
Bow.prototype.drawTrajectory = function () {

  // constants
  var MARCH_SPEED = 40,
    currentArrowSpeed = (this.currentArrowSpeed < this.MAX_ARROW_SPEED) ? this.currentArrowSpeed : this.MAX_ARROW_SPEED;

  // variables
  var ctx = this.trajectory.context,
    correctionFactor = 0.99,
    theta = -this.sprite.rotation,
    x = 0,
    y = 0,
    t;

  ctx.clearRect(0, 0, game.width, game.height);

  this.timeOffset = this.timeOffset + 1 || 0;
  this.timeOffset = this.timeOffset % MARCH_SPEED;

  for (t = 0 + this.timeOffset / (1000 * MARCH_SPEED / 60); t < 3; t += 0.03) {
    x = currentArrowSpeed * t * Math.cos(theta) * correctionFactor;
    y = currentArrowSpeed * t * Math.sin(theta) * correctionFactor - 0.5 * this.GRAVITY * t * t;
    // TODO make this disappear over the distance
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(x + this.sprite.x, this.sprite.y - y, 3, 3);
    if (y < -game.height / 2 + 50) {
      break;
    }
  }

  this.trajectory.dirty = true;

};

Bow.prototype.clearTrajectory = function () {

  this.trajectory.context.clearRect(0, 0, game.width, game.height);
  this.trajectory.dirty = true;

};

/*
 * @method update
 */
Bow.prototype.update = function () {


  // angle the bow towards the pointer (mouse / finger)
  this.sprite.rotation = game.physics.arcade.angleToPointer(this.sprite);

  // release an arrow
  if (game.input.activePointer.isDown) {
    this.currentArrowSpeed += 10;
    this.drawTrajectory();
  }

  if (game.input.activePointer.isUp && this.currentArrowSpeed > 0) {
    this.shoot();
    this.clearTrajectory();
  }

  // update the position of any alive arrows
  this.arrows.update();

};

module.exports = Bow;
