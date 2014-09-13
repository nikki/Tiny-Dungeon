TM.Screens = (function() {
  var canvas = TM.Canvas,
      board = TM.Board,
      dungeon = TM.Dungeon,
      touch = !!('ontouchstart' in window);

  var Screens = {
    title : function() {
      ctx.save();
      ctx.scale(TM.s, TM.s);
      canvas.drawText({ text : 'Tiny Dungeon', x : 13.5, y : 42 });
      canvas.drawText({ text : (touch ? 'Tap' : 'Click') + ' To Start' , x : (touch ? 14 : 12.5), y : 66 });
      ctx.restore();
    },

    game : function() {
      dungeon.render();
      board.render();
      TM.timer.render();
    },

    social : function() {
      var stats = dungeon.stats;

      ctx.save();
      ctx.scale(TM.s, TM.s);

      canvas.drawText({ text : 'You survived', x : 13.5, y : 12 });
      canvas.drawText({ text : 'for ' + stats.totalTimeSurvived + ' seconds', x : 12 - ('' + stats.totalTimeSurvived).length * 2, y : 22 });
      canvas.drawText({ text : 'in the', x : 28, y : 32 });
      canvas.drawText({ text : 'Tiny Dungeon', x : 13.5, y : 42 });

      ctx.fillStyle = '#00B0ED';
      ctx.fillRect(2, 59, ((TM.w / TM.s) / 2) - 3, 15);
      canvas.drawText({ text : 'Tweet', x : 8.5, y : 64 });

      ctx.fillStyle = '#3B5998';
      ctx.fillRect(((TM.w / TM.s) / 2) + 1, 59, ((TM.w / TM.s) / 2) - 3, 15);
      canvas.drawText({ text : 'Share', x : 48, y : 64 });

      ctx.fillStyle = 'green';
      ctx.fillRect(2, 76, (TM.w / TM.s) - 4, 15);
      canvas.drawText({ text : 'Play Again', x : 18, y : 81 });

      canvas.drawText({
        text :
          '   Enemies killed: ' + stats.totalEnemiesKilled +
          '   Longest spell chain: ' + stats.longestSpellChain +
          '   Highest critical strike: ' + stats.highestCrit.amount + ' on ' + stats.highestCrit.e +
          '   Most damage taken: ' + stats.mostDamageTaken.amount + ' from ' + stats.mostDamageTaken.e +
          '   Damage taken overall: ' + stats.damageTakenOverall,
        x : 80 - this.statsX,
        y : 103
      });
      this.statsX += 0.3;
      if (this.statsX > 800) this.statsX = 0;

      ctx.restore();
    },

    statsX : 0
  };

  return Screens;

})();