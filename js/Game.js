TM.Game = (function(w, d) {
  var font = TM.Font,
      canvas = TM.Canvas,
      loop = TM.Loop,
      board = TM.Board,
      dungeon = TM.Dungeon,
      Timer = TM.Timer;

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
        dungeon.castSpell(this.chain.length);

        // currently fighting enemy?
        if (TM.wait) {
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
      font.init();
      canvas.init();

      event = new CustomEvent('gameReady');
      d.dispatchEvent(event);
    },

    ready : function() {
      loop.start(function frame(seconds) { // start game loop
        ctx.clearRect(0, 0, TM.w, TM.h);

        // update
        if (dungeon.player) {
          dungeon.update(seconds);
          board.update(seconds);
          TM.timer.update(seconds);
          TWEEN.update();
        }

        // render
        TM.Screens[TM.currentScreen]();
      });
    },

    start : function() {
      TM.currentScreen = 'game';
      $('.social').style.display = 'none';

      TM.timer = new Timer;
      TM.timer.init();
      TM.wait = false;
      board.init();
      dungeon.init();
    },

    pause : function(hidden) {
      if (TM.currentScreen !== 'game') return;
      TM.timer.pause(hidden);
    },

    end : function() {
      var link = 'http://js13kgames.com/entries/tiny-dungeon/',
          text = 'I survived for ' + dungeon.stats.totalTimeSurvived + ' seconds in the Tiny Dungeon ' + link;

      // set screen
      TM.currentScreen = 'social';
      TM.Screens.statsX = 0;

      // set link hrefs
      $('.tweet').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&hashtags=js13k', '_blank';
      $('.share').href = 'http://www.facebook.com/sharer.php?s=100&p[title]=Tiny+Dungeon+js13k+Game&p[url]=' + encodeURIComponent(link) + '&p[summary]=' + encodeURIComponent(text + ' #js13k'), '_blank';

      // show screen
      $('.social').style.display = 'block';
    }
  };

  return Game;

})(window, document);