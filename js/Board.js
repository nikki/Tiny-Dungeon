TM.Board = (function() {
  var utils = TM.Utils,
      canvas = TM.Canvas,
      Tile = TM.Tile;

  var tile = new Tile,
      tileSize = tile.size + tile.spacing,
      board = [];

  var Board = {
    x : 13,
    y : 53,
    size : 5,

    numTiles : 0,
    isAnimated : false,
    animatedTiles : [],

    create : function() {
      var x, y, grid = [];

      for (x = 0; x < this.size; x++) {
        grid[x] = [];
        for (y = 0; y < this.size; y++) {
          grid[x][y] = new Tile({ x : x, y : y });
          this.numTiles += 1;
        }
      }

      return grid;
    },

    createTileAt : function(p) {
      board[p.x][p.y] = new Tile(p);
      this.numTiles += 1;
    },

    getTileAtCell : function(cell) {
      if (this.cellInBounds(cell)) {
        return board[cell.x][cell.y];
      }
      return null;
    },

    getTileAtScreenPos : function(pos) {
      pos.x = (pos.x - c.offsetLeft) / TM.s;
      pos.y = (pos.y - c.offsetTop) / TM.s;

      if (this.posInBounds(pos)) {
        pos.x -= this.x;
        pos.x /= tileSize;
        pos.y -= this.y;
        pos.y /= tileSize;

        return this.getTileAtCell({ x : pos.x | 0, y : pos.y | 0 });
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

    posInBounds : function(p) {
      return p.x >= this.x && p.x < this.x + (this.size * tileSize) &&
             p.y >= this.y && p.y < this.y + (this.size * tileSize);
    },

    validMove : function(prev, next) {
      return ((next.x === prev.x - 1 || next.x === prev.x + 1) && next.y === prev.y) ||
             ((next.y === prev.y - 1 || next.y === prev.y + 1) && next.x === prev.x);
    },

    getFarthestPos : function(cell) {
      var prev;

      do {
        prev = cell;
        cell = { x : prev.x, y : prev.y + 1 }; // downwards vector
      } while (this.cellInBounds(cell) && !this.getTileAtCell(cell));

      return prev;
    },

    repopulate : function() {
      var x, y, cell, tile, pos, sY = [];

      for (x = 0; x < this.size; x++) {
        sY[x] = 0;

        for (y = this.size - 1; y >= 0; y--) { // reverse dir
          cell = { x : x, y : y };
          tile = this.getTileAtCell(cell);

          if (tile) {
            pos = this.getFarthestPos(cell);
            this.moveTileTo(tile, pos);
          } else {
            sY[x] += 1; // save tween pos
          }
        }
      }

      for (x = 0; x < this.size; x++) {
        for (y = 0; y < this.size; y++) {
          cell = { x : x, y : y };
          tile = this.getTileAtCell(cell);

          if (!tile) {
            this.createTileAt({ x : x, y : y, sY : -sY[x] });
          }
        }
      }
    },

    init : function() {
      board = this.create();
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
      this.drawGrid(this.x - 0.5, this.y - 0.5);

      // render tiles
      this.drawTiles(this.x, this.y);
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
      ctx.rect(0, 0, this.size * tileSize, this.size * tileSize);
      ctx.clip();

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

      new TWEEN.Tween(tile.screen.pos)
          .to(next.screen.pos, 100)
          .onComplete(function() {
            // if (callback) callback();
          })
          .start();
    }
  };

  return Board;

})();