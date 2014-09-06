TM.Dungeon = (function() {
  var canvas = TM.Canvas,
      Wall = TM.Wall,
      Enemy = TM.Enemy,
      r = TM.Utils.rand;

  var Dungeon = {
    x : 2,
    y : 12,
    w : 76,
    h : 38,

    walls : [],

    maxEnemies : 1,
    enemies : [],
    currentEnemy : {},

    pos : 0,
    vel : 1000,
    wait : true,

    init : function() {
      this.walls.push(new Wall);

/*
      var _this = this;
      setTimeout(function() {
        _this.wait = true;
      }, 2000);
*/

      this.spawnEnemies();
    },

    spawnEnemies : function() {
      var i;

      for (i = 0; i < this.maxEnemies; i++) {
        this.enemies.push(new Enemy({ depth : i * 100, level : this.level }));
      }
    },

    createWalls : function() {

    },

    update : function(seconds) {
      var i;

      this.vel = this.wait ? 0 : 1000;
      this.pos += this.vel;

      for (i = 0; i < this.walls.length; i++) {
        this.walls[i].update(this.vel, seconds);
        if (this.walls[i].dead) this.walls.splice(i, 1);
      }

      for (i = 0; i < this.enemies.length; i++) {
        this.enemies[i].update(this.vel, seconds);
        if (this.enemies[i].dead) this.enemies.splice(i, 1);
      }

      if (this.enemies.length < 1) this.spawnEnemies();

      this.currentEnemy = this.enemies[0];
    },

    render : function() {
      var i, j;

      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.translate(this.x, this.y);
      ctx.rect(0, 0, this.w, this.h);
      ctx.clip();

      canvas.fillRect({ c : '#42382C', x : 0, y : 0, w : this.w, h : this.h });

      // render front to back
      i = this.walls.length;
      while (i--) {
        // this.walls[i].render(this.w, this.h);
      }

      j = this.enemies.length;
      while (j--) {
        this.enemies[j].render(this.w, this.h);
      }

      ctx.restore();
    }
  };

  return Dungeon;

})();