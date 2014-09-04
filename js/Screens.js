TM.Screens = (function() {
  var canvas = TM.Canvas,
      board = TM.Board,
      dungeon = TM.Dungeon,
      timer = TM.Timer;

  var Screens = {
    title : function() {
      canvas.drawImage(TM.images['scr_title'], 0, 0);
    },

    tutorial : function() {

    },

    game : function() {
      // canvas.drawImage(TM.images['scr_game'], 0, 0);
      // dungeon.render();
      board.render();
      timer.render();
    },

    gameover : function() {

    }
  };

  return Screens;

})();