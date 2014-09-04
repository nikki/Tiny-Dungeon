TM.Board = (function() {
  var utils = TM.Utils,
      canvas = TM.Canvas,
      Tile = TM.Tile;

  var tile = new Tile,
      tileSize = tile.size + tile.spacing,
      board = [];

  var Board = {
    size : 4,
    numTiles : 0,
    isAnimated : false,
    animatedTiles : [],

    create : function() {
      var x, y, grid = [];

      for (x = 0; x < this.size; x++) {
        grid[x] = [];
        for (y = 0; y < this.size; y++) {
          grid[x][y] = null;
        }
      }

      return grid;
    },

    createTileAt : function(p) {
      board[p.x][p.y] = new Tile(p);
      this.numTiles += 1;
    },

    createRandomTile : function(n) {
      var i = 0, r = utils.rand, p;

      while (i < n) {
        p = { x : r(0, 3), y : r(0, 3) };

        if (!this.getTileAt(p)) {
          this.createTileAt(p);
          i++;
        }
      }
    },

    getTileAt : function(cell) {
      if (this.cellInBounds(cell)) {
        return board[cell.x][cell.y];
      }
      return null;
    },

    moveTileTo : function(tile, cell) {
      board[tile.x][tile.y] = null;
      board[cell.x][cell.y] = tile;
      tile.setNewPos(cell);
    },

    removeTileAt : function(cell) {
      board[cell.x][cell.y] = null;
      this.numTiles -= 1;
    },

    cellInBounds : function(p) {
      return p.x >= 0 && p.x < this.size &&
             p.y >= 0 && p.y < this.size;
    },

    init : function() {
      board = this.create();
      this.createRandomTile(4);
    },

    update : function(seconds) {
      var x, y;

      for (x = 0; x < this.size; x++) {
        for (y = 0; y < this.size; y++) {
          if (board[x][y] instanceof Tile) {
            board[x][y].update();
          }
        }
      }
    },

    render : function() {
      // render grid outlines
      this.drawGrid(9.5, 49.5);

      // render tiles
      this.drawTiles(10, 50);
    },

    drawGrid : function(x, y) {
      var i = 0;

      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.translate(x, y);

      for (; i < this.size + 1; i++) {
        canvas.drawLine({ o : 'v', c : 'black', x : i * tileSize, y : this.size * tileSize });
        canvas.drawLine({ o : 'h', c : 'black', x : this.size * tileSize, y : i * tileSize });
      }

      ctx.restore();
    },

    drawTiles : function(x, y) {
      var x, y;

      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.translate(x, y);

      for (x = 0; x < this.size; x++) {
        for (y = 0; y < this.size; y++) {
          if (board[x][y] instanceof Tile) {
            board[x][y].render();
          }
        }
      }

      ctx.restore();
    },

    animateMerge: function(tile, next, callback) {
      this.animatedTiles.push(tile);
      this.animatedTiles.push(next);

      new TWEEN.Tween(tile.screenPos)
          .to(next.screenPos, 100)
          .onComplete(function() {
            // if (callback) callback();
          })
          .start();
    }
  };

  return Board;

})();