TM.Tile = (function() {
  var utils = TM.Utils;

  var spells = ['earth', 'water', 'air', 'fire'];

  function Tile(p) {
    this.type = utils.rand(0, 3);
    this.spell = spells[this.type];
    this.image = TM.images['t_' + this.spell];
    this.size = 16;
    this.spacing = 1;

    if (!p) return;
    // this.pos = { x : p.x, y : p.y };
    this.x = p.x;
    this.y = p.y;
    this.screenPos = { x : p.x * (this.size + this.spacing), y : p.y * (this.size + this.spacing) };
    this.newPos = {};
  }

  Tile.prototype.setNewPos = function(p) {
    var _this = this;

    // update new pos
    this.x = p.x;
    this.y = p.y;
    this.newPos = { x : p.x * (this.size + this.spacing), y : p.y * (this.size + this.spacing) };

    // tween to new pos
    new TWEEN.Tween(_this.screenPos)
        .to(_this.newPos, 100)
        .start();
  };

  Tile.prototype.tween = function() {


  };

  Tile.prototype.update = function() {

  };

  Tile.prototype.render = function() {
    ctx.drawImage(this.image, this.screenPos.x, this.screenPos.y);
  };

  return Tile;

})();