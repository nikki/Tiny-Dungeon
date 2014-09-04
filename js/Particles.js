TM.Particles = (function() {
  var canvas = TM.Canvas,
      r = TM.Utils.rand;

  /**
   * Particle constructor
   */

  function Particle(o) {
    this.x = o.x;
    this.y = o.y;
    this.size = 1;
    this.vel = { x : o.vel.x, y : o.vel.y };
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
    // this.lifeSpan -= seconds;
    // if (this.lifeSpan < 0) this.dead = true;
  };

  Particle.prototype.render = function() {
    ctx.save();
    ctx.scale(TM.s, TM.s);
    ctx.translate(0, 0);

    canvas.fillRect({
      // c : 'rgba(255, 255, 255,' + this.alpha + ')',
      c : this.colour,
      x : this.x,
      y : this.y,
      w : this.size,
      h : this.size,
    });

    ctx.restore();
  };


  /**
   * Emitter constructor
   */

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


  /**
   * Module interface
   */

  var Particles = {
    emitters : [],

    settings : {
      earth : {
        particle : {
          x : 0,
          y : 0,
          minSize : 1,
          sizeRange : 1,
          vel : {
            x : 1,
            y : 1
          },
          gravity : {
            x : 0,
            y : 0
          },
          rotation : 0,
          colour : 'green',
          alpha : 0.5,
          minLife : 10,
          lifeRange : 2
        },
        emitter : {
          max : 30
        }
      },

      water : {
        particle : {
          x : 0,
          y : 0,
          minSize : 1,
          sizeRange : 1,
          vel : {
            x : 1,
            y : 1
          },
          gravity : {
            x : 0.5,
            y : 2
          },
          rotation : 315,
          colour : 'blue',
          alpha : 1,
          minLife : 10,
          lifeRange : 2
        },
        emitter : {
          max : 30
        }
      },

      air : {
        particle : {
          x : 0,
          y : 0,
          minSize : 1,
          sizeRange : 1,
          vel : {
            x : 1,
            y : 1
          },
          gravity : {
            x : 0,
            y : 0
          },
          rotation : 0,
          colour : 'white',
          alpha : 0.5,
          minLife : 10,
          lifeRange : 2
        },
        emitter : {
          max : 30
        }
      },

      fire : {
        particle : {
          x : 0,
          y : 0,
          minSize : 1,
          sizeRange : 1,
          vel : {
            x : 1,
            y : 1
          },
          gravity : {
            x : 0,
            y : -10
          },
          rotation : 0,
          colour : 'red',
          alpha : 0.5,
          minLife : 10,
          lifeRange : 2
        },
        emitter : {
          max : 30
        }
      },

      torch : {
        // how to project z?
      }
    },

    create : function(name) {
      this.emitters.push(new Emitter(this.settings[name]));
    },

    update : function(seconds) {
      var i;

      for (i = 0; i < this.emitters.length; i++) {
        this.emitters[i].update(seconds);
      }
    },

    render : function() {
      var i;

      for (i = 0; i < this.emitters.length; i++) {
        this.emitters[i].render();
      }
    }
  };

  return Particles;

})();