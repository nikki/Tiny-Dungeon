TM.Screens = (function() {
  var canvas = TM.Canvas,
      board = TM.Board,
      dungeon = TM.Dungeon,
      particles = TM.Particles,
      timer = TM.Timer;

  var Screens = {
    title : function() {
      canvas.drawImageScaled({ img : TM.images['scr_title'], x : 0, y : 0 });
    },

    tutorial : function() {

    },

    game : function() {
      // hud
      dungeon.render();
      timer.render();
      board.render();
      // particles.render();
    },

    gameover : function() {

    }
  };

  return Screens;

})();