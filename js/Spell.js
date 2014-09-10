TM.Spell = (function() {
  function Spell(o) {
    var _this = this;

    this.p1 = { x : o.x, y : o.y };
    // this.p2 = { x : o.enemy.x, y : o.enemy.y };
    // this.p2 = staff position (fixed)

    this.name = o.name;
    this.strength = o.strength;
    this.lifeSpan = o.lifeSpan;

    // new TWEEN.Tween(_this.p1)
    //     .to(_this.p2, _this.lifeSpan * 1000)
    //     .start();
  }

  Spell.prototype.update = function(seconds) {
    this.lifeSpan -= seconds;
    if (this.lifeSpan < 0) this.dead = true;
  };

  Spell.prototype.render = function() {
    ctx.save();
    ctx.scale(TM.s, TM.s);

    ctx.beginPath()
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();

    ctx.restore();
  };

  return Spell;

})();