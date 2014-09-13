TM.Board = (function() {
  var canvas = TM.Canvas,
      Tile = TM.Tile;

  var tile = new Tile,
      tS = tile.size + tile.spacing,
      board = [];

  var Board = {
    x : 2,
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

    // create tile at
    cTA : function(p) {
      board[p.x][p.y] = new Tile(p);
      this.numTiles += 1;
    },

    // get tile at cell
    gTAC : function(cell) {
      if (this.cellInBounds(cell)) {
        return board[cell.x][cell.y];
      }
      return null;
    },

    // get tile at screen pos
    gTASP : function(pos) {
      pos.x = (pos.x - c.offsetLeft) / TM.s;
      pos.y = (pos.y - c.offsetTop) / TM.s;

      if (this.posInBounds(pos)) {
        pos.x -= this.x;
        pos.x /= tS;
        pos.y -= this.y;
        pos.y /= tS;

        return this.gTAC({ x : pos.x | 0, y : pos.y | 0 });
      }

      return null;
    },

    moveTileTo : function(tile, cell) {
      board[tile.x][tile.y] = null;
      board[cell.x][cell.y] = tile;
      tile.nP(cell);
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
      return p.x >= this.x && p.x < this.x + (this.size * tS) &&
             p.y >= this.y && p.y < this.y + (this.size * tS);
    },

    validMove : function(prev, next) {
      return ((next.x === prev.x - 1 || next.x === prev.x + 1) && next.y === prev.y) ||
             ((next.y === prev.y - 1 || next.y === prev.y + 1) && next.x === prev.x);
    },

    // get farthest pos
    gFP : function(cell) {
      var prev;

      do {
        prev = cell;
        cell = { x : prev.x, y : prev.y + 1 }; // downwards vector
      } while (this.cellInBounds(cell) && !this.gTAC(cell));

      return prev;
    },

    // replace matched tiles
    rMT : function() {
      var x, y, cell, tile, pos, sY = [];

      for (x = 0; x < this.size; x++) {
        sY[x] = 0;

        for (y = this.size - 1; y >= 0; y--) { // reverse dir
          cell = { x : x, y : y };
          tile = this.gTAC(cell);

          if (tile) {
            pos = this.gFP(cell);
            this.moveTileTo(tile, pos);
          } else {
            sY[x] += 1; // save tween pos
          }
        }
      }

      for (x = 0; x < this.size; x++) {
        for (y = 0; y < this.size; y++) {
          cell = { x : x, y : y };
          tile = this.gTAC(cell);

          if (!tile) {
            this.cTA({ x : x, y : y, sY : -sY[x] });
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
      var x, y;

      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.translate(this.x, this.y);

      ctx.beginPath();
      ctx.rect(0, 0, this.size * tS, this.size * tS);
      ctx.clip();
      ctx.closePath();

      for (x = 0; x < this.size; x++) {
        for (y = 0; y < this.size; y++) {
          if (board[x][y] instanceof Tile) {
            board[x][y].render();
          }
        }
      }

      ctx.restore();
    }
  };

  return Board;

})();