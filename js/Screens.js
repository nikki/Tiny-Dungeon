TM.Screens = (function() {
  var canvas = TM.Canvas,
      board = TM.Board,
      dungeon = TM.Dungeon,
      particles = TM.Particles,
      spells = TM.Spells;

  var Screens = {
    title : function() {
      // canvas.drawImageScaled({ img : TM.images['scr_title'], x : 0, y : 0 });
      canvas.drawText({ text : 'hello there', x : 10, y : 10 });
    },

    game : function() {
      // hud
      dungeon.render();
      board.render();
      spells.render();
      // particles.render();
    },

    social : function() {

    }
  };

  return Screens;

})();