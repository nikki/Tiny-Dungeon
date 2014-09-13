TM.Particles = (function() {
  var canvas = TM.Canvas,
      Particle = TM.Particle,
      r = TM.Utils.randInt;

  var Particles = {
    particles : [],

    create : function(o, max) {
      var i;

      for (i = 0; i < max; i++) {
        this.particles.push(new Particle(type));
      }
    },

    update : function(seconds) {
      var i;

      for (i = 0; i < this.particles.length; i++) {
        this.particles[i].update(seconds);
      }
    },

    render : function() {
      var i;

      for (i = 0; i < this.particles.length; i++) {
        this.particles[i].render();
      }
    }
  };

  return Particles;

})();