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

    create : function(boardPos, from, to, strength) {
      var enemy = to.currentEnemy,
          merge = {
            spell : {
              name : from.spell,
              strength : strength,
              x : boardPos.x + from.screenPos.x + (from.size / 2),
              y : boardPos.y + from.screenPos.y + (from.size / 2)
            },
            enemy : {
              name : enemy.name,
              weakTo : enemy.weakTo,
              x : to.x + (to.w / 2),
              y : to.y + (to.h / 2)
            }
          },
          options = utils.merge(settings[from.spell], merge);

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
        this.spells[i].render();
      }
    }
  };

  return Spells;

})();