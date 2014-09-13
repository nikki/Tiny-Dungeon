TM.Timer = (function() {
  var canvas = TM.Canvas;

  function Timer() {
    this.x = 70;
    this.y = 52;
    this.size = { x : 8, y : 66 };
    this.maxTime = 120;
    this.startTime = null;
    this.time = 0;
    this.tick = (this.size.y / this.maxTime);
    this.timePenalty = null;
    this.paused = false;
    this.pausedAt = null;
  };

  Timer.prototype.init = function() {
    this.startTime = +new Date();
  };

  Timer.prototype.update = function(seconds) {
    if (this.startTime) {
      this.time += seconds;
    }

    if (this.timePenalty && this.time > this.timePenalty.end) {
      this.timePenalty = null;
    }
  };

  Timer.prototype.render = function() {
    ctx.save();
    ctx.scale(TM.s, TM.s);
    ctx.translate(this.x, this.y);

    // outline
    canvas.fillRect({ c : 'gray', x : 0, y : 0, w : this.size.x, h : this.size.y });

    // background
    canvas.fillRect({ c : 'black', x : 1, y : 1, w : this.size.x - 2, h : this.size.y - 2 });

    // penalty
    if (this.timePenalty) {
      canvas.fillRect({ c : '#267AF6', x : 1, y : 1 + ((this.timePenalty.from + this.timePenalty.to) | 0) * this.tick, w : this.size.x - 2, h : (this.size.y - 2) - (this.time | 0) * this.tick });
      canvas.fillRect({ c : 'red', x : 1, y : 1 + (this.timePenalty.from | 0) * this.tick, w : this.size.x - 2, h : (this.timePenalty.to | 0) * this.tick });
    }

    // time
    canvas.fillRect({ c : '#267AF6', x : 1, y : 1 + (this.time | 0) * this.tick, w : this.size.x - 2, h : (this.size.y - 2) - (this.time | 0) * this.tick });

    ctx.restore();
  };

  Timer.prototype.add = function(seconds, callback) {
    if ((this.time - seconds) > 0) {
      this.time -= seconds;
    } else {
      this.time = 0;
    }

    callback('+' + seconds + ' SECS');
  };

  Timer.prototype.remove = function(seconds, callback) {
    this.timePenalty = {
      from : this.time + seconds + 0.8,
      to : seconds,
      end : this.time
    };
    this.time += seconds;

    callback('-' + seconds + ' SECS');
  };

  Timer.prototype.pause = function(p) {
    this.paused = p;
    if (this.paused) {
      this.pausedAt = +new Date();
    } else {
      this.startTime += (+new Date() - this.pausedAt);
    }
  }

  return Timer;

})();