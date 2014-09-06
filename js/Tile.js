TM.Tile = (function() {
  var utils = TM.Utils;

  var spells = ['earth', 'water', 'air', 'fire'];

  function Tile(p) {
    var _this = this;

    this.type = utils.rand(0, 3);
    this.spell = spells[this.type];
    this.image = TM.images['t_' + this.spell];
    this.size = 12;
    this.spacing = 1;

    if (!p) return; // for blank tile in board module
    this.x = p.x;
    this.y = p.y;

    this.screenPos = { x : p.x * (this.size + this.spacing), y : p.y * (this.size + this.spacing) };
    this.newPos = {};

    if (p.sY) this.setNewPos({ x : p.x, y : p.y, sY : p.sY });
  }

  Tile.prototype.update = function(seconds) {

  };

  Tile.prototype.render = function() {
    if (this.selected) {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(this.image, this.screenPos.x, this.screenPos.y, this.size, this.size);
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(this.image, this.screenPos.x, this.screenPos.y, this.size, this.size);
    }
  };

  Tile.prototype.setNewPos = function(p) {
    var _this = this;

    // update new pos
    this.x = p.x;
    this.y = p.y;
    if (p.sY) _this.screenPos.y += p.sY * (this.size + this.spacing);
    this.newPos = { x : p.x * (this.size + this.spacing), y : p.y * (this.size + this.spacing) };

    // tween to new pos
    new TWEEN.Tween(_this.screenPos)
        .to(_this.newPos, 100)
        .start();
  };

  return Tile;

})();