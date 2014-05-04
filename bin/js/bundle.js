(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @class base
 * This is the root file for the Phaser Boilerplate. All other files are included from this one.
 *
 * @author Matt Gale <matt@littleball.co.uk>
 **/

/*globals require*/


var game = require('./game'),
    boot = require('./scenes/boot.js'),
    preloader = require('./scenes/preloader'),
    mainMenu = require('./scenes/mainMenu'),
    level1 = require('./scenes/level1');

game.state.add('boot', boot, false);
game.state.add('preloader', preloader, false);
game.state.add('mainMenu', mainMenu, false);
game.state.add('level1', level1, false);

game.state.start('boot');

},{"./game":4,"./scenes/boot.js":5,"./scenes/level1":6,"./scenes/mainMenu":7,"./scenes/preloader":8}],2:[function(require,module,exports){
var Phaser = (window.Phaser),
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

},{"../game":4}],3:[function(require,module,exports){
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

},{"../classes/Arrows":2,"../game":4}],4:[function(require,module,exports){
var Phaser = (window.Phaser);

var game = new Phaser.Game(480, 320, Phaser.AUTO, 'content', null);

module.exports = game;

},{}],5:[function(require,module,exports){
/*globals module*/

var game = require('../game');

module.exports = {

  preload: function () {

    // the preloader images
    this.load.image('loadingBar', 'assets/preloader_loading.png');

  },

  create: function () {

    // max number of fingers to detect
    this.input.maxPointers = 1;

    // auto pause if window looses focus
    this.stage.disableVisibilityChange = true;

    if (game.device.desktop) {
      this.stage.scale.pageAlignHorizontally = true;
    }

    game.state.start('preloader', true, false);
  }

};

},{"../game":4}],6:[function(require,module,exports){
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

},{"../classes/Bow":3,"../game":4}],7:[function(require,module,exports){
/*globals module, require, localStorage*/

var Phaser = (window.Phaser),
  game = require('../game');

module.exports = {

  create: function () {

    var tween,
      highscore = localStorage.getItem("highscore"),
      lastscore = localStorage.getItem("lastscore"),
      style = {
        font: '30px Arial',
        fill: '#fff'
      };

    if (highscore) {
      this.highscore = highscore;
    } else {
      this.highscore = 0;
    }

    this.background = this.add.sprite(0, 0, 'menu_background');
    this.background.alpha = 0;

    this.labelTitle = game.add.text(20, 20, "Tap to start", style);
    this.labelTitle.alpha = 0;

    this.highscoreLabel = game.add.text(20, 280, "High Score: " + this.highscore, style);

    if (lastscore) {
      this.lastscoreLabel = game.add.text(20, 240, "Last Score: " + lastscore, style);
    }

    tween = this.add.tween(this.background)
      .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    this.add.tween(this.labelTitle)
      .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

    tween.onComplete.add(this.addPointerEvents, this);
  },

  addPointerEvents: function () {
    this.startGame();
    this.input.onDown.addOnce(this.startGame, this);
  },

  startGame: function () {
    game.state.start('level1', true, false);
  }

};

},{"../game":4}],8:[function(require,module,exports){
/*globals module, require*/

var Phaser = (window.Phaser);

module.exports = {

  preload: function () {

    this.loadingBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loadingBar');
    this.loadingBar.anchor.x = 0.5;
    this.loadingBar.anchor.y = 0.5;
    this.load.setPreloadSprite(this.loadingBar);

    this.game.load.image('menu_background', 'assets/menu_background.png');
    this.game.load.image('bow', 'assets/bow.png');
    this.game.load.image('arrow', 'assets/arrow.png');

  },

  create: function () {
    var tween = this.add.tween(this.loadingBar)
      .to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(this.startMainMenu, this);
  },

  startMainMenu: function () {
    this.game.state.start('mainMenu', true, false);
  }

};

},{}]},{},[1])