TM.Game = (function(w, d) {
  var canvas = TM.Canvas,
      loop = TM.Loop,
      board = TM.Board,
      dungeon = TM.Dungeon,
      timer = TM.Timer,
      particles = TM.Particles,
      audio = TM.Audio;

window.audio = audio; // !!!

  var Game = {
    init : function() {
      var event;

      audio.init();
      canvas.init();
      dungeon.init();
      timer.init();
      board.init();

      event = new CustomEvent('gameStart');
      d.dispatchEvent(event);
    },

    transition : function(next) {
      TM.currentScreen = next;
    },

    start : function() {
      loop.start(function frame(seconds) {
        ctx.clearRect(0, 0, TM.w, TM.h);

        // update
        // hud
        dungeon.update(seconds);
        timer.update(seconds);
        board.update(seconds);
        particles.update(seconds);
        TWEEN.update();

        // render
        TM.Screens[TM.currentScreen]();
      });
    },

    move : function(dir) {
      var _this = this, x, y, tile,
          vector = this.getVector(dir),
          moves = this.getMoves(vector);

      // iterate over cells in vector direction
      moves.x.forEach(function(x) {
        moves.y.forEach(function(y) {
          var pos, next;

          cell = { x : x, y : y };
          tile = board.getTileAt(cell);

          if (tile) {
            pos = _this.findFarthestPos(cell, vector);
            next = board.getTileAt(pos.next);

            if (next && next.type === tile.type) {
              // console.log('merge of ' + tile.spell);
              // board.animateMerge(tile, next);

              // audio.play('thud');
              // timer.remove(4);

              board.removeTileAt(tile);
              board.removeTileAt(next);

              particles.create(tile.spell);

              // board.moveTileTo(tile, pos.next);
            } else {
              // console.log(tile, pos.farthest);
              board.moveTileTo(tile, pos.farthest);
            }
          }
        });
      });

      // new random tile on each move
      this.addNewTile();
    },

    addNewTile : function() {
      if (board.numTiles < board.size * board.size) {
        board.createRandomTile(1);

        if (board.numTiles >= board.size * board.size) {
          console.log('board full');
        }
      }
    },

    getMoves : function(vector) {
      var i, moves = { x : [], y : [] };

      for (i = 0; i < board.size; i++) {
        moves.x.push(i);
        moves.y.push(i);
      }

      if (vector.x === 1) moves.x = moves.x.reverse();
      if (vector.y === 1) moves.y = moves.y.reverse();

      return moves;
    },

    getVector : function(dir) {
      var map = {
        'left' : { x : -1, y : 0 },
        'up' : { x : 0, y : -1 },
        'right' : { x : 1,  y : 0 },
        'down' : { x : 0,  y : 1 }
      }

      return map[dir];
    },

    findFarthestPos : function(cell, vector) {
      var prev;

      do {
        prev = cell;
        cell = { x : prev.x + vector.x, y : prev.y + vector.y };
      } while (board.cellInBounds(cell) && !board.getTileAt(cell));

      return {
        farthest : prev,
        next : cell
      }
    },

    end : function() {
      TM.currentScreen = 'title';
    },

    quit : function() {

    }
  };

  return Game;

})(window, document);