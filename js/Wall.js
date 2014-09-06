TM.Wall = (function() {
  var canvas = TM.Canvas;

  function Wall() {
    this.fov = 60;
    this.depth = 100;
    this.step = 0.5;
    this.stepTimer = 0;

    this.x = 0;
    this.y = 0;
    this.z = this.depth;

    this.w = 10;
    this.h = 10;

    this.dead = false;
  }

  Wall.prototype.update = function(vel, seconds) {
    this.stepTimer += seconds;
    if (this.stepTimer > this.step) {
      this.z -= vel * seconds;
      this.stepTimer = 0;
    }
  };

  Wall.prototype.render = function(sw, sh) {
    var scale = this.fov / (this.fov + this.z);

    var x = (this.x * scale) + (sw / 2);
    var y = (this.y * scale) + (sh / 2);

    canvas.fillRect({ c : 'black', x : x - (this.w * scale) / 2, y : y - (this.h * scale) / 2, w : this.w * scale, h : this.h * scale });

    if (this.z < -this.fov) this.dead = true;
  };

  return Wall;

})();