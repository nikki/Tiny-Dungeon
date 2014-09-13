TM.Tile = (function() {
  var utils = TM.Utils;

  var spells = ['earth', 'water', 'air', 'fire'],
      colours = ['green', 'blue', 'magenta', 'red'],
      blend = (function() {
        ctx.globalCompositeOperation = 'screen';
        return ctx.globalCompositeOperation === 'screen';
      })();

  function Tile(p) {
    var _this = this;

    this.type = utils.r(0, 3);
    this.colour = colours[this.type];
    this.spell = spells[this.type];
    this.image = TM.images['t_' + this.spell];
    this.size = 12;
    this.spacing = 1;

    if (!p) return; // for blank tile in board module
    this.x = p.x;
    this.y = p.y;

    this.sP = { x : p.x * (this.size + this.spacing), y : p.y * (this.size + this.spacing) };
    this.newPos = {};

    if (p.sY) this.nP({ x : p.x, y : p.y, sY : p.sY });
  }

  Tile.prototype.update = function(seconds) {};

  Tile.prototype.render = function() {
    if (this.selected) {
      if (blend) {
        ctx.drawImage(this.image, this.sP.x, this.sP.y, this.size, this.size);
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(this.image, this.sP.x, this.sP.y, this.size, this.size);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.drawImage(this.image, this.sP.x, this.sP.y, this.size, this.size);
      }
    } else {
      if (blend) {
        ctx.drawImage(this.image, this.sP.x, this.sP.y, this.size, this.size);
      } else {
        ctx.globalAlpha = 0.75;
        ctx.drawImage(this.image, this.sP.x, this.sP.y, this.size, this.size);
        ctx.globalAlpha = 1;
      }
    }
  };

  Tile.prototype.nP = function(p) {
    var _this = this;

    // update new pos
    this.x = p.x;
    this.y = p.y;
    if (p.sY) _this.sP.y += p.sY * (this.size + this.spacing);
    this.newPos = { x : p.x * (this.size + this.spacing), y : p.y * (this.size + this.spacing) };

    // tween to new pos
    new TWEEN.Tween(_this.sP)
        .to(_this.newPos, 100)
        .start();
  };

  return Tile;

})();