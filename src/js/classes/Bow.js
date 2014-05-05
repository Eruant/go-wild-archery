var game = require('../game'),
  Arrows = require('../classes/Arrows');

/**
 * @class Bow
 */
function Bow() {

  // constants
  this.GRAVITY = 980;
  this.MAX_BULLET_SPEED = 700;
  
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
  var speed = this.MAX_BULLET_SPEED;

  // release an arrow
  this.arrows.shoot(this.sprite.x, this.sprite.y, this.sprite.rotation, speed);
};

/*
 * @method drawTrajectory
 */
Bow.prototype.drawTrajectory = function () {

  var MARCH_SPEED = 40;

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
    x = this.MAX_BULLET_SPEED * t * Math.cos(theta) * correctionFactor;
    y = this.MAX_BULLET_SPEED * t * Math.sin(theta) * correctionFactor - 0.5 * this.GRAVITY * t * t;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(x + this.sprite.x, this.sprite.y - y, 3, 3);
    if (y < -game.height / 2 + 50) {
      break;
    }
  }

  this.trajectory.dirty = true;
};

/*
 * @method update
 */
Bow.prototype.update = function () {

  this.drawTrajectory();

  // angle the bow towards the pointer (mouse / finger)
  this.sprite.rotation = game.physics.arcade.angleToPointer(this.sprite);

  // release an arrow
  if (game.input.activePointer.isDown) {
    this.shoot();
  }

  // update the position of any alive arrows
  this.arrows.update();

};

module.exports = Bow;
