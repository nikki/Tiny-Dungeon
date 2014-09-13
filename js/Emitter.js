TM.Emitter = (function() {
  var Particle = TM.Particle;

  function Emitter(settings) {
    var emitter = settings.emitter,
        particle = settings.particle;

    this.x = emitter.x;
    this.y = emitter.y;
    this.max = emitter.max;

    this.particles = [];
    for (i = 0; i < this.max; i++) {
      this.particles.push(new Particle(particle));
    }
  }

  Emitter.prototype.update = function(seconds) {
    var i;

    for (i = 0; i < this.particles.length; i++) {
      if (this.particles[i].dead) {
        this.particles.splice(1, i);
      } else {
        this.particles[i].update(seconds);
      }
    }
  };

  Emitter.prototype.render = function() {
    var i;

    ctx.save();
    ctx.scale(TM.s, TM.s);
    ctx.translate(this.x, this.y);

    for (i = 0; i < this.particles.length; i++) {
      this.particles[i].render();
    }

    ctx.restore();
  };

  return Emitter;

})();