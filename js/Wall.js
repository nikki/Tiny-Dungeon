TM.Wall = (function() {
  var canvas = TM.Canvas;

  function Wall(o) {
    this.i = o.i;
    this.x1 = o.i * (o.w * 0.125);
    this.y1 = o.i * (o.h * 0.125);
    this.w1 = o.w;
    this.x2 = (o.i + 1) * (o.w * 0.125);
    this.y2 = (o.i + 1) * (o.h * 0.125);
    this.w2 = o.w * 0.75;
    this.z = 200;
    this.c = o.c;

// console.log(this);

/*
    this.w1 = TM.w / o.i;
    this.w2 = TM.w / (o.i + 1);

    this.x = 0;
    this.y = 0;
    this.w = 10;

    this.h = 10;
    this.z = o.i * this.h;
*/
    this.fov = 60;
    this.step = 0.25;
    this.stepTimer = 0;
  }

  Wall.prototype.update = function(vel, seconds) {
    this.stepTimer += seconds;
    if (this.stepTimer > this.step) {
      this.z -= vel * seconds;
      this.stepTimer = 0;
    }

    if (this.z < -this.fov) this.z = 200;
  };

  Wall.prototype.render = function(sw, sh) {
    var scale = this.fov / (this.fov + this.z);
    var x1 = (this.x1 * scale) - (sw / 2);
    var y1 = (this.y1 * scale) + (sh / 2);
    var w1 = (this.w1 * scale) + (sw / 2);
    var x2 = (this.x2 * scale) + (sw / 2);
    var y2 = (this.y2 * scale) + (sh / 2);
    var w2 = (this.w2 * scale) + (sw / 2);

    // ctx.fillStyle = 'red';
    // ctx.fillRect(x - (this.w * scale) / 2, y - (this.h * scale) / 2, this.w * scale, this.h * scale);

    // if (this.z < -this.fov) this.dead = true;

    canvas.segment(x1, this.y1 * scale, w1, x2, this.y2 * scale, w2, this.c);


  };

  return Wall;

})();