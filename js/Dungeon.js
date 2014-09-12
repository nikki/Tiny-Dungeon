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
    y : 12,
    w : 76,
    h : 38,

    stats : null,
    player : null,
    enemy : null,
    walls : [],
    texts : [],

    init : function() {
      this.stats = null;

      this.player = null;
      this.spawnPlayer();

      this.enemy = null;
      this.spawnEnemy();

      this.createWalls();
    },

    spawnPlayer : function() {
      this.player = new Player();
    },

    spawnEnemy : function() {
      var enemy = new Enemy({ depth : 200, level : this.player.level });

      if (this.enemy && this.enemy.type === enemy.type) {
        return this.spawnEnemy();
      }

      this.enemy = enemy;
    },

    hitPlayer : function() {
      // play audio
      // audio.play('thud');
    },

    hitEnemy : function(boardPos, tile, strength) {
      var _this = this;

      // hit enemy
      this.enemy.hit({ spell : tile.spell, strength : strength }, function(crit, dmg, text) {
        // update crit stat
        if (crit) _this.player.stats.update('highestCrit', { amount : dmg, enemy : _this.enemy.name });

        // draw damage text
        _this.texts.push(new Text({ x : 2, y : 9, dY : 1, text : text }));
      });

      // play audio
      audio.play(tile.spell);
    },

    castSpell : function(boardPos, tile, strength) {
      // create spell effect
      spells.create({
        name : tile.spell,
        strength : strength,
        x : boardPos.x + tile.screenPos.x + (tile.size / 2),
        y : boardPos.y + tile.screenPos.y + (tile.size / 2)
      });

      // player cast animation
      this.player.castAnimation();

      // update spell chain stat
      this.player.stats.update('longestSpellChain', strength);
    },

    gainTime : function(seconds) {
      var _this = this;

      TM.timer.add(seconds, function(text) {
        _this.texts.push(new Text({ x : 52, y : 34, dY : 1, text : text }));
      });

      // play audio
      // audio.play('ping');
    },

    createWalls : function() {
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
    },

    update : function(seconds) {
      var i, j;

      // update player
      if (TM.timer.time >= TM.timer.maxTime) {
        // update total time survived
        this.player.stats.update('totalTimeSurvived', ((+new Date() - TM.timer.startTime) / 1000) | 0);

        // game over
        this.stats = this.player.stats;
        event = new CustomEvent('gameEnd');
        d.dispatchEvent(event);

        // destroy player
        this.player = null;
        // TM.timer = null;
        return;
      } else {
        this.player.update(seconds);

        // console.log(this.player.stepTimer);

        // walk noise
        // audio.play('walk');
      }

      // met an enemy, wait camera position
      if (this.enemy.z < this.enemy.fov / 2) TM.wait = true;

      // update enemy
      if (this.enemy.dead) {
        this.spawnEnemy();
        this.player.stats.update('totalEnemiesKilled', this.player.stats.totalEnemiesKilled + 1);
        TM.wait = false;
      } else {
        this.enemy.update(this.player.currentVel, seconds);
      }

      // update walls
      for (i = 0; i < this.walls.length; i++) {
        this.walls[i].update(this.player.currentVel, seconds);
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
      ctx.rect(0, 0, this.w, this.h);
      ctx.clip();

      // draw background
      canvas.fillRect({ c : '#42382C', x : 0, y : 0, w : this.w, h : this.h });

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
        canvas.drawText({ text : (this.enemy.name).toUpperCase(), x : 2 * (this.x + this.w / 2), y : 2 * (this.y + this.h - 6) });
      }

      ctx.restore();
    }
  };

  return Dungeon;

})(document);