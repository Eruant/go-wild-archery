var game = require('../game'),
  Arrows = require('../classes/Arrows');

/**
 * @class Bow
 */
function Bow() {

  // constants
  this.GRAVITY = 980;
  
  // add the bow sprite
  this.sprite = game.add.sprite(50, game.height / 2, 'bow');
  this.sprite.anchor.setTo(1, 0.5);

  // add a quiver of arrows
  this.arrows = new Arrows(5);

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
  var speed = 700;

  // release an arrow
  this.arrows.shoot(this.sprite.x, this.sprite.y, this.sprite.rotation, speed);
};

/*
 * @method update
 */
Bow.prototype.update = function () {

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
