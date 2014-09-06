TM.Particles = (function() {
  var Emitter = TM.Emitter,
      canvas = TM.Canvas,
      r = TM.Utils.rand;

  var settings = {
    earth : {
      particle : {
        x : 0,
        y : 0,
        minSize : 1,
        sizeRange : 1,
        vel : { x : 1, y : 1 },
        gravity : { x : 0, y : 0 },
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
        vel : { x : 1, y : 1 },
        gravity : { x : 0.5, y : 2 },
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
        vel : { x : 1, y : 1 },
        gravity : { x : 0, y : 0 },
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
        vel : { x : 1, y : 1 },
        gravity : { x : 0, y : 0 },
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

    }
  };

  var Particles = {
    emitters : [],

    create : function(name) {
      this.emitters.push(new Emitter(settings[name]));
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