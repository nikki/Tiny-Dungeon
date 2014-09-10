TM.Spells = (function() {
  var utils = TM.Utils,
      Spell = TM.Spell;

  var settings = {
    earth : {
      lifeSpan : 0.5
    },

    fire : {
      lifeSpan : 0.5
    },

    water : {
      lifeSpan : 0.5
    },

    air : {
      lifeSpan : 0.5
    }
  };

  var Spells = {
    spells : [],

    create : function(o) {
      var options = utils.merge(settings[o.name], o);
      this.spells.push(new Spell(options));
    },

    update : function(seconds) {
      var i;

      for (i = 0; i < this.spells.length; i++) {
        if (this.spells[i].dead) {
          this.spells.splice(1, i);
        } else {
          this.spells[i].update(seconds);
        }
      }
    },

    render : function() {
      var i;

      for (i = 0; i < this.spells.length; i++) {
        // this.spells[i].render();
      }
    }
  };

  return Spells;

})();