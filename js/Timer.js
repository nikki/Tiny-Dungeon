TM.Timer = (function(d) {
  var canvas = TM.Canvas,
      event;

  function Timer() {
    this.x = 0;
    this.y = 0;
    this.size = { x : 5, y : 69 };
    this.maxTime = 60;
    this.startTime = null;
    this.elapsedTime = 0;
    this.tick = (this.size.y / this.maxTime);
    this.timePenalty = null;
  };

  Timer.prototype.init = function() {
    this.startTime = +new Date();
  };

  Timer.prototype.update = function(seconds) {
    if (this.startTime) {
      this.elapsedTime += seconds;
    }

    if (this.timePenalty) {
      if (this.elapsedTime > this.timePenalty.end) {
        this.timePenalty = null;
      }
    }

    if (this.elapsedTime >= this.maxTime) {
      // game over
      event = new CustomEvent('gameEnd');
      d.dispatchEvent(event);
    }
  };

  Timer.prototype.render = function() {
    ctx.save();
    ctx.scale(TM.s, TM.s);
    ctx.translate(2, 49);

    // outline
    canvas.fillRect({ c : 'white', x : 0, y : 0, w : this.size.x, h : this.size.y });

    // background
    canvas.fillRect({ c : 'black', x : 1, y : 1, w : this.size.x - 2, h : this.size.y - 2 });

    // penalty
    if (this.timePenalty) {
      canvas.fillRect({ c : '#267AF6', x : 1, y : 1 + ((this.timePenalty.from + this.timePenalty.to) | 0) * this.tick, w : this.size.x - 2, h : (this.size.y - 2) - (this.elapsedTime | 0) * this.tick });
      canvas.fillRect({ c : 'red', x : 1, y : 1 + (this.timePenalty.from | 0) * this.tick, w : this.size.x - 2, h : (this.timePenalty.to | 0) * this.tick });
    }

    // time
    canvas.fillRect({ c : '#267AF6', x : 1, y : 1 + (this.elapsedTime | 0) * this.tick, w : this.size.x - 2, h : (this.size.y - 2) - (this.elapsedTime | 0) * this.tick });

    ctx.restore();
  };

  Timer.prototype.add = function(seconds) {
    if ((this.elapsedTime - seconds) > 0) {
      this.elapsedTime -= seconds;
    } else {
      this.elapsedTime = 0;
    }
  };

  Timer.prototype.remove = function(seconds) {
    this.timePenalty = {
      from : this.elapsedTime,
      to : seconds,
      end : this.elapsedTime + seconds + 0.8
    };
    this.elapsedTime += seconds;
  };

  return new Timer;

})(document);