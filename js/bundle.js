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

function Arrow() {

  this.sprite = game.add.sprite(0, 0, 'arrow');
  this.sprite.anchor.setTo(0.5, 0.5);

  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

  this.sprite.kill();
}

module.exports = Arrow;

},{"../game":4}],3:[function(require,module,exports){
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

},{"../classes/Arrow":2,"../game":4}],4:[function(require,module,exports){
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
var /*Phaser = require('phaser'),*/
  game = require('../game'),
  Bow = require('../classes/Bow');


module.exports = {

  create: function () {

    game.stage.backgroundColor = 0xccddff;

    this.bow = new Bow();
  },

  update: function () {
    if (game.input.activePointer.isDown) {
      this.bow.shoot();
    }
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