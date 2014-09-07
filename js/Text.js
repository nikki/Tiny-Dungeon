TM.Text = (function() {
  var canvas = TM.Canvas;

  function Text(o) {
    this.x = o.x;
    this.y = o.y;
    this.vY = -0.4;

    this.text = o.text;

    this.lifeSpan = 1;
    this.dead = false;
  }

  Text.prototype.update = function(seconds) {
    this.y += this.vY;
    this.lifeSpan -= seconds;
    if (this.lifeSpan < 0) this.dead = true;
  };

  Text.prototype.render = function() {
    ctx.fillStyle = 'white';
    ctx.fillText(this.text, this.x, this.y - this.vY);
  };

  return Text;

})();