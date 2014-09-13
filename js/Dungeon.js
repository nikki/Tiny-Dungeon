TM.Dungeon = (function(d) {
  var canvas = TM.Canvas,
      r = TM.Utils.rand,
      spells = TM.Spells,
      audio = TM.Audio,
      Player = TM.Player,
      Enemy = TM.Enemy,
      Wall = TM.Wall,
      Text = TM.Text;

  var Dungeon = {
    x : 2,
    y : 2,
    w : 76,
    h : 48,

    stats : null,
    player : null,
    enemy : null,
    walls : [],
    texts : [],

    init : function() {
      this.pos = 0;
      this.vel = 1000;

      this.stats = null;
      this.player = null;
      this.spawnPlayer();

      this.enemy = null;
      this.spawnEnemy();

      this.bg = TM.images['w_bg'];
      this.createWalls();
    },

    spawnPlayer : function() {
      this.player = new Player();
    },

    spawnEnemy : function() {
      var enemy = new Enemy({ level : this.player.level });

      if (this.enemy && this.enemy.type === enemy.type) return this.spawnEnemy();
      this.enemy = enemy;
    },

    hitPlayer : function() {
      var _this = this, hit = this.player.hit({ strength : this.enemy.strength, critChance : this.enemy.critChance });

      TM.timer.remove(hit.damage, function(text) {
        if (hit.crit) _this.texts.push(new Text({ x : 118, y : 78, dY : 1, text : '*CRIT!*' }));
        _this.texts.push(new Text({ x : 118, y : 88, dY : 1, text : text }));

        // update damage stats
        _this.player.stats.update('mostDamageTaken', { amount : hit.damage, enemy : _this.enemy.name });
        _this.player.stats.update('damageTakenOverall', _this.player.stats.damageTakenOverall + hit.damage);
      });

      // play audio
      audio.play(r(0,1) ? 'thud' : this.enemy.name);
    },

    hitEnemy : function(boardPos, tile, strength) {
      var _this = this;

      // hit enemy
      this.enemy.hit({ spell : tile.spell, strength : strength }, function(crit, damage, text) {
        // draw damage text
        _this.texts.push(new Text({ x : 9, y : 20, dY : 1, text : text }));

        // update crit stat
        if (crit) {
          _this.player.stats.update('highestCrit', { amount : damage, enemy : _this.enemy.name });
          _this.hitPlayer(); // 33% chance of immediate retaliation
          return;
        }

        // 33% chance of immediate retaliation
        if (!r(0,2)) _this.hitPlayer();
      });

      // play audio
      audio.play(tile.spell);
    },

    castSpell : function(strength) {
      // player cast animation
      this.player.castAnimation();

      // update spell chain stat
      this.player.stats.update('longestSpellChain', strength);
    },

    gainTime : function(seconds) {
      var _this = this;

      TM.timer.add(seconds, function(text) {
        _this.texts.push(new Text({ x : 118, y : 88, dY : 1, text : text }));
      });

      // play audio
      // audio.play('ping');
    },

    createWalls : function() {
      var i;

      for (i = 0; i < 4; i++) {
        this.walls.push(new Wall({
          i : i,
          w : this.w,
          h : this.h,
          c : (i % 2 ? 'orange' : 'green')
        })); // bottom
      }
/*
          x1 : 0,
          y1 : 0,
          w1 : this.w,
          h1 : 0,
          x2 : this.w/8,
          y2 : this.h/8,
          w2 : (this.w/4)*3,
          h2 : 0,
          c : 'red'
*/
/*
      this.walls.push(new Wall({
        x1 : 0,
        y1 : 0,
        w1 : this.w,
        h1 : 0,
        x2 : this.w/8,
        y2 : this.h/8,
        w2 : (this.w/4)*3,
        h2 : 0,
        c : 'red'
      })); // top

      this.walls.push(new Wall({
        x1 : this.w/8,
        y1 : this.h/8,
        w1 : (this.w/4)*3,
        h1 : 0,
        x2 : this.w/4, // /4
        y2 : this.h/4, // /4
        w2 : this.w/2, // /2
        h2 : 0,
        c : 'pink'
      })); // top x 2

      this.walls.push(new Wall({
        x1 : 0,
        y1 : 0,
        w1 : 0,
        h1 : this.h,
        x2 : this.w/4,
        y2 : this.h/4,
        w2 : 0,
        h2 : this.h/2,
        c : 'yellow'
      })); // left

      this.walls.push(new Wall({
        x1 : 0,
        y1 : this.h,
        w1 : this.w,
        h1 : 0,
        x2 : this.w/4,
        y2 : (this.h/4)*3,
        w2 : this.w/2,
        h2 : 0,
        c : 'orange'
      })); // bottom

      this.walls.push(new Wall({
        x1 : this.w,
        y1 : 0,
        w1 : 0,
        h1 : this.h,
        x2 : (this.w/4)*3,
        y2 : (this.h/4),
        w2 : 0,
        h2 : this.h/2,
        c : 'green'
      })); // right
*/
    },

    update : function(seconds) {
      var i, j;

      // gameover?
      if (this.checkTimer()) return;

      // update position
      this.vel = TM.wait ? 0 : 1000;
      this.pos += this.vel;

      // update player
      this.player.update(seconds);

      // met an enemy, wait camera position
      if (this.enemy.z < 5) TM.wait = true;

      // update enemy
      if (this.enemy.dead) {
        this.spawnEnemy();
        this.player.level += 1.4;
        this.player.stats.update('totalEnemiesKilled', this.player.stats.totalEnemiesKilled + 1);
        TM.wait = false;
      } else {
        this.enemy.update(this.vel, seconds);
      }

      // update walls
      for (i = 0; i < this.walls.length; i++) {
        this.walls[i].update(this.vel, seconds);
        if (this.walls[i].dead) this.walls.splice(i, 1);
      }
    },

    render : function() {
      var i, j;

      /**
       * Full scale
       */

      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.translate(this.x, this.y);

      canvas.fillRect({ c : 'brown', x : 0, y : 0, w : this.w, h : this.h });
      ctx.rect(1, 1, this.w - 2, this.h - 2);
      ctx.clip();

      // draw background
      ctx.drawImage(this.bg, 19, 12);

      // render walls front to back
      i = this.walls.length;
      while (i--) {
        this.walls[i].render(this.w, this.h);
      }

      // render current enemy
      this.enemy.render(this.w, this.h);

      // render player sprite
      this.player.render();

      // restore context
      ctx.restore();


      /**
       * Half scale
       */

      // half scale for text (not ideal but nvm)
      ctx.save();
      ctx.scale(2, 2);

      // render text at half scale
      for (j = 0; j < this.texts.length; j++) {
        this.texts[j].render();
      }

      // draw half-scaled (ie. 4px) enemy nameplate - it's the only way it'll fit
      if (TM.wait) {
        canvas.drawText({ text : (this.enemy.name).toUpperCase(), x : 2 * (this.x + this.w / 2) - (this.enemy.name.length / 2) * 4.3, y : 2 * (this.y + this.h - 7) });
      }

      ctx.restore();
    },

    checkTimer: function() {
      if (TM.timer.time >= TM.timer.maxTime) {
        // update total time survived
        this.player.stats.update('totalTimeSurvived', ((+new Date() - TM.timer.startTime) / 1000) | 0);

        // game over
        this.stats = this.player.stats;
        event = new CustomEvent('gameEnd');
        d.dispatchEvent(event);

        // destroy player
        this.player = null;
        return true;
      }
    }
  };

  return Dungeon;

})(document);