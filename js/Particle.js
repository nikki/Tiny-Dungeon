TM.Particle = (function() {
  var r = TM.Utils.rand,
      canvas = TM.Canvas;

  function Particle(o) {
    this.x = o.x;
    this.y = o.y;
    this.size = 1;
    this.vel = { x : r(-1, 1), y : o.vel.y };
    this.gravity = { x : o.gravity.x, y : o.gravity.y };
    this.colour = o.colour;
    this.alpha = o.alpha;
    this.lifeSpan = r(this.minLife, this.minLife + this.lifeRange);
    this.dead = false;
  }

  Particle.prototype.update = function(seconds) {
    this.vel.x += this.gravity.x * seconds;
    this.vel.y += this.gravity.y * seconds;
    this.x += this.vel.x * seconds;
    this.y += this.vel.y * seconds;
    this.lifeSpan -= seconds;
    if (this.lifeSpan < 0) this.dead = true;
  };

  Particle.prototype.render = function() {
    canvas.fillRect({
      c : 'rgba(255, 255, 255,' + this.alpha + ')',
      c : this.colour,
      x : this.x,
      y : this.y,
      w : this.size,
      h : this.size,
    });
  };

  return Particle;

})();