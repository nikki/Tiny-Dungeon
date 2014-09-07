TM.Dungeon = (function() {
  var canvas = TM.Canvas,
      Wall = TM.Wall,
      Enemy = TM.Enemy,
      Text = TM.Text,
      spells = TM.Spells,
      r = TM.Utils.rand;

  var Dungeon = {
    x : 2,
    y : 12,
    w : 76,
    h : 38,

    walls : [],
    enemy : {},
    texts : [],

    pos : 0,
    vel : 1000,
    wait : false,

    init : function() {
      this.walls.push(new Wall);

/*
      var _this = this;
      setTimeout(function() {
        _this.wait = true;
      }, 2000);
*/

      this.spawnEnemy();
    },

    spawnEnemy : function(d) {
      this.enemy = new Enemy({ depth : 200, level : this.level });
    },

    hitEnemy : function(boardPos, tile, strength) {
      var _this = this;

      // create spell effect
      spells.create(boardPos, tile, strength);

      // hit enemy, draw text on callback
      this.enemy.hit({ spell : tile.spell, strength : strength }, function(damage) {
        _this.texts.push(new Text({ x : _this.x + (_this.w / 4), y : _this.y + (_this.h / 4), text : damage }));
      });
    },

    createWalls : function() {

    },

    update : function(seconds) {
      var i, j;

      // update dungeon pos
      this.vel = this.wait ? 0 : 1000;
      this.pos += this.vel;

      // update walls
      for (i = 0; i < this.walls.length; i++) {
        this.walls[i].update(this.vel, seconds);
        if (this.walls[i].dead) this.walls.splice(i, 1);
      }

      // met an enemy, wait camera position
      if (this.enemy.z < this.enemy.fov / 2) this.wait = true;

      // update enemy
      if (this.enemy.dead) {
        this.spawnEnemy();
        this.wait = false;
      } else {
        this.enemy.update(this.vel, seconds);
      }

      // update damage text
      for (j = 0; j < this.texts.length; j++) {
        this.texts[j].update(seconds);
        if (this.texts[j].dead) this.texts.splice(j, 1);
      }
    },

    render : function() {
      var i, j;

      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.translate(this.x, this.y);
      ctx.rect(0, 0, this.w, this.h);
      ctx.clip();

      // draw background
      canvas.fillRect({ c : '#42382C', x : 0, y : 0, w : this.w, h : this.h });

      // render walls front to back
      i = this.walls.length;
      while (i--) {
        // this.walls[i].render(this.w, this.h);
      }

      // render current enemy
      this.enemy.render(this.w, this.h);

      // render text
      for (j = 0; j < this.texts.length; j++) {
        this.texts[j].render();
      }

      ctx.restore();
    }
  };

  return Dungeon;

})();