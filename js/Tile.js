TM.Tile = (function() {
  var utils = TM.Utils;

  var spells = ['earth', 'water', 'air', 'fire'];

  function Tile(p) {
    var _this = this;

    this.type = utils.rand(0, 3);
    this.spell = spells[this.type];
    this.image = TM.images['t_' + this.spell];
    this.size = 16;
    this.spacing = 1;

    if (!p) return; // for blank tile in board module
    this.x = p.x;
    this.y = p.y;
    this.screen = {};

    this.screenPos = { x : p.x * (this.size + this.spacing) + this.size / 2, y : p.y * (this.size + this.spacing) + this.size / 2 };
    this.newPos = {};
    this.screenSize = { w : 0, h : 0 };

    new TWEEN.Tween(this.screenPos)
      .to({ x : p.x * (this.size + this.spacing), y : p.y * (this.size + this.spacing) }, 200)
      .easing(TWEEN.Easing.Back.Out)
      .start();

    new TWEEN.Tween(this.screenSize)
      .easing(TWEEN.Easing.Back.Out)
      .to({ w : _this.size, h : _this.size }, 200)
      .start();
  }

  Tile.prototype.update = function(seconds) {

  };

  Tile.prototype.render = function() {
    ctx.drawImage(this.image, this.screenPos.x, this.screenPos.y, this.screenSize.w, this.screenSize.h);
  };

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

  return Tile;

})();