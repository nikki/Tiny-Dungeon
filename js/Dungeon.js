TM.Dungeon = (function(d) {
  var canvas = TM.Canvas,
      r = TM.Utils.r,
      spells = TM.Spells,
      Player = TM.Player,
      Enemy = TM.Enemy,
      Text = TM.Text;

  var Dungeon = {
    x : 2,
    y : 3,
    w : 76,
    h : 48,

    stats : null,
    p : null,
    e : null,
    texts : [],

    init : function() {
      this.pos = 0;
      this.vel = 1000;

      this.stats = null;
      this.p = null;
      this.sP();

      this.e = null;
      this.sE();

      this.bg = TM.images['bg'];
    },

    sP : function() {
      this.p = new Player();
    },

    sE : function() {
      var e = new Enemy({ level : this.p.level });

      if (this.e && this.e.type === e.type) return this.sE();
      this.e = e;
    },

    hP : function() {
      var _this = this, hit = this.p.hit({ strength : this.e.strength, critChance : this.e.critChance });

      TM.timer.remove(hit.damage, function(text) {
        if (hit.crit) _this.texts.push(new Text({ x : 118, y : 78, dY : 1, text : '*CRIT!*' }));
        _this.texts.push(new Text({ x : 118, y : 88, dY : 1, text : text }));

        // update damage stats
        _this.p.stats.update('mostDamageTaken', { amount : hit.damage, e : _this.e.name });
        _this.p.stats.update('damageTakenOverall', _this.p.stats.damageTakenOverall + hit.damage);
      });

      // e 'animation' ^^
      this.e.lAt = 0;
      this.e.attacking = true;
      this.e.attackFor = 0.5;
    },

    hE : function(boardPos, tile, strength) {
      var _this = this;

      // hit e
      this.e.hit({ spell : tile.spell, strength : strength }, function(crit, damage, text) {
        // draw damage text
        _this.texts.push(new Text({ x : 9, y : 20, dY : 1, text : text }));

        // update crit stat
        if (crit) {
          _this.p.stats.update('highestCrit', { amount : damage, e : _this.e.name });
          _this.hP(); // 33% chance of immediate retaliation
          return;
        }

        // 33% chance of immediate retaliation
        if (!r(0,2)) _this.hP();
      });
    },

    castSpell : function(strength) {
      // p cast animation
      this.p.cast();

      // update spell chain stat
      this.p.stats.update('longestSpellChain', strength);
    },

    gainTime : function(seconds) {
      var _this = this;

      TM.timer.add(seconds, function(text) {
        _this.texts.push(new Text({ x : 118, y : 88, dY : 1, text : text }));
      });
    },

    update : function(seconds) {
      var i, j;

      // gameover?
      if (this.checkTimer()) return;

      // update position
      this.vel = TM.wait ? 0 : 1000;
      this.pos += this.vel;

      // update p
      this.p.update(seconds);

      // met an e, wait camera position
      if (this.e.z < 5) TM.wait = true;

      // update e
      if (this.e.dead) {
        this.sE();
        this.p.level += 1.4;
        this.p.stats.update('totalEnemiesKilled', this.p.stats.totalEnemiesKilled + 1);
        TM.wait = false;
      } else {
        if (TM.wait && this.e.lAt > 8) this.hP();
        this.e.update(this.vel, seconds);
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

      // draw frame
      canvas.fillRect({ c : 'gray', x : 0, y : 0, w : this.w, h : this.h });

      ctx.beginPath();
      ctx.rect(1, 1, this.w - 2, this.h - 2);
      ctx.clip();
      ctx.closePath();

      // draw background
      ctx.drawImage(this.bg, 0, 0);

      // render current e
      this.e.render(this.w, this.h);

      // render p sprite
      this.p.render();

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

      // draw half-scaled (ie. 4px) e nameplate - it's the only way it'll fit
      if (TM.wait) {
        canvas.drawText({ text : (this.e.name).toUpperCase(), x : 2 * (this.x + this.w / 2) - (this.e.name.length / 2) * 4.3, y : 2 * (this.y + this.h - 7) });
      }

      ctx.restore();
    },

    checkTimer: function() {
      if (TM.timer.time >= TM.timer.mT) {
        // update total time survived
        this.p.stats.update('totalTimeSurvived', ((+new Date() - TM.timer.sT) / 1000) | 0);

        // game over
        this.stats = this.p.stats;
        event = new CustomEvent('gameEnd');
        d.dispatchEvent(event);

        // destroy p
        this.p = null;
        return true;
      }
    }
  };

  return Dungeon;

})(document);