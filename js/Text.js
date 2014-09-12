TM.Text = (function() {
  var canvas = TM.Canvas;

  function Text(o) {
    var _this = this;

    this.x = o.x;
    this.y = o.y;
    this.dY = o.dY * 6;
    this.alpha = 1;
    this.text = o.text;
    this.lifeSpan = 1.2;
    this.dead = false;

    // takes place of update fn
    new TWEEN.Tween({ y : this.y, alpha : this.alpha })
        .to({ y : this.y + this.dY, alpha : 0 }, _this.lifeSpan * 1000)
        .easing(TWEEN.Easing.Exponential.In)
        .onUpdate(function() {
          _this.y = this.y;
          _this.alpha = this.alpha;
        })
        .onComplete(function() {
          _this.dead = true;
        })
        .start();
  }

  Text.prototype.render = function() {
    ctx.globalAlpha = this.alpha;
    canvas.drawText({ text : this.text, x : this.x, y : this.y });
    ctx.globalAlpha = 1;
  };

  return Text;

})();