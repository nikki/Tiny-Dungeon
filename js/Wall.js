TM.Wall = (function() {
  var canvas = TM.Canvas;

  function Wall(o) {
    this.fov = 60;
    this.depth = 100;
    this.step = 0.5;
    this.stepTimer = 0;

    this.x = o.x;
    this.y = o.y;
    this.z = this.depth;
    this.w = o.w;
    this.h = o.h;

    this.x1 = o.x1;
    this.y1 = o.y1;
    this.w1 = o.w1;
    this.h1 = o.h1;
    this.x2 = o.x2;
    this.y2 = o.y2;
    this.w2 = o.w2;
    this.h2 = o.h2;
    this.c = o.c;

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

    // canvas.fillRect({ c : 'black', x : x - (this.w * scale) / 2, y : y - (this.h * scale) / 2, w : this.w * scale, h : this.h * scale });
    // if (this.z < -this.fov) this.dead = true;

    canvas.polygon(this);
  };

  return Wall;

})();