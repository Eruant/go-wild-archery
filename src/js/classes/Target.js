function Target() {

  this.invincible = true;
}

Target.prototype.hit = function () {
  if (!this.invicible) {
    this.sprite.kill();
  }
};

module.exports = Target;
