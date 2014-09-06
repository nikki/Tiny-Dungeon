TM.Emitter = (function() {
  var Particle = TM.Particle;

  function Emitter(settings) {
    var emitter = settings.emitter,
        particle = settings.particle;

    this.particles = [];
    for (i = 0; i < emitter.max; i++) {
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

    for (i = 0; i < this.particles.length; i++) {
      this.particles[i].render();
    }
  };

  return Emitter;

})();