TM.Game = (function(w, d) {
  var canvas = TM.Canvas,
      loop = TM.Loop,
      board = TM.Board,
      dungeon = TM.Dungeon,
      spells = TM.Spells,
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
          if (board.validMove(this.currentTile, tile)) {

            // this isn't a previous tile?
            previousTile = this.chain.filter(function(prev) {
              return tile === prev;
            });

            // undo chain
            if (previousTile.length) {
              undo = this.chain.indexOf(previousTile[0]);
              previousTile = this.chain.splice(undo, this.chain.length - undo);
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
          var cell = { x : tile.x, y : tile.y };
          board.removeTileAt(cell);
        });

        // cast the spell
        dungeon.castSpell({ x : board.x, y : board.y }, this.currentTile, this.chain.length);

        // currently fighting enemy?
        if (dungeon.wait) {
          // hit enemy
          dungeon.hitEnemy({ x : board.x, y : board.y }, this.currentTile, this.chain.length);
        } else {
          // matches += time
          dungeon.gainTime(this.chain.length / 2); // 0.5 secs for each tile matched
        }

        // add more tiles to board
        board.replaceMatchedTiles();
      } else {
        // deselect first tile
        if (this.chain[0]) this.chain[0].selected = false;
      }

      // reset chain
      this.chain = [];
    },

    init : function() {
      var event;

      audio.init();
      canvas.init();
      board.init();

      event = new CustomEvent('gameReady');
      d.dispatchEvent(event);
    },

    ready : function() {
      loop.start(function frame(seconds) { // start game loop
        ctx.clearRect(0, 0, TM.w, TM.h);

        // update
        if (dungeon.player) {
          // hud(?)
          dungeon.update(seconds);
          board.update(seconds);
          spells.update(seconds);
          particles.update(seconds);
          TWEEN.update();
        }

        // render
        TM.Screens[TM.currentScreen]();
      });
    },

    start : function() {
      TM.currentScreen = 'game';
      dungeon.init();
    },

    end : function() {

      TM.currentScreen = 'title';
    },

    quit : function() {

    }
  };

  return Game;

})(window, document);