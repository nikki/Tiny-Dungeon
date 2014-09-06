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
    currentTile : {},
    chain : [],

    firstInChain : function(o) {
      var tile = board.getTileAtScreenPos(o);

      if (tile) {
        tile = board.getTileAtCell(tile);

        if (tile) {
          tile.selected = true;
          this.chain.push(tile);
          this.currentTile = tile;
        }
      }
    },

    nextInChain : function(o) {
      var tile = board.getTileAtScreenPos(o),
          previousTile, undo;

      if (tile) {
        tile = board.getTileAtCell(tile);

        // tile is not same tile and is of correct type
        if (tile && tile !== this.currentTile && tile.type === this.currentTile.type) {

          // is this move a valid move?
          if (this.validMove(this.currentTile, tile)) {

            // this isn't a previous tile?
            previousTile = this.chain.filter(function(prev) {
              return tile === prev;
            });

            // undo chain
            if (previousTile.length) {
              undo = this.chain.indexOf(previousTile[0]);
              previousTile = this.chain.splice(undo, this.chain.length - undo);
              console.log(previousTile);
              previousTile.forEach(function(tile) {
                tile.selected = false;
              });
            }

            tile.selected = true;
            this.chain.push(tile);
            this.currentTile = tile;
          }
        }
      }
    },

    lastInChain : function() {
      if (this.chain.length > 1) {
        // remove tiles
        this.chain.forEach(function(tile) {
          board.removeTileAt(tile);
        });
      }

      // reset chain
      this.chain = [];
    },

    validMove : function(prev, next) {
      return ((next.x === prev.x - 1 || next.x === prev.x + 1) && next.y === prev.y) ||
             ((next.y === prev.y - 1 || next.y === prev.y + 1) && next.x === prev.x);
    },

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

    end : function() {
      TM.currentScreen = 'title';
    },

    quit : function() {

    }
  };

  return Game;

})(window, document);