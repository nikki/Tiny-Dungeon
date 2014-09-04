TM.Screens = (function() {
  var canvas = TM.Canvas,
      board = TM.Board,
      dungeon = TM.Dungeon;

  var Screens = {
    title : function() {
      canvas.drawImage(TM.images['scr_title'], 0, 0);
    },

    tutorial : function() {

    },

    game : function() {
      // dungeon.render();
      // canvas.drawImage(TM.images['scr_game'], 0, 0);
      board.render();
    },

    gameover : function() {

    }
  };

  return Screens;

})();