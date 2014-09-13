TM.Timer = (function() {
  var canvas = TM.Canvas;

  function Timer() {
    this.x = 68;
    this.y = 53;
    this.size = { x : 10, y : 64 };
    this.mT = 60;
    this.sT = null;
    this.time = 0;
    this.tick = (this.size.y / this.mT);
  };

  Timer.prototype.init = function() {
    this.sT = +new Date();
  };

  Timer.prototype.update = function(seconds) {
    if (this.sT) {
      this.time += seconds;
    }

    if (this.tP && this.time > this.tP.end) {
      this.tP = null;
    }
  };

  Timer.prototype.render = function() {
    ctx.save();
    ctx.scale(TM.s, TM.s);
    ctx.translate(this.x, this.y);

    // outline
    canvas.fillRect({ c : '#ccc', x : 0, y : 0, w : this.size.x, h : this.size.y });

    // background
    canvas.fillRect({ c : 'black', x : 1, y : 1, w : this.size.x - 2, h : this.size.y - 2 });

    // penalty
    if (this.tP) {
      canvas.fillRect({ c : '#267AF6', x : 1, y : 1 + ((this.tP.from + this.tP.to) | 0) * this.tick, w : this.size.x - 2, h : (this.size.y - 2) - (this.time | 0) * this.tick });
      canvas.fillRect({ c : 'red', x : 1, y : 1 + (this.tP.from | 0) * this.tick, w : this.size.x - 2, h : (this.tP.to | 0) * this.tick });
    }

    // time
    canvas.fillRect({ c : '#267AF6', x : 1, y : 1 + (this.time | 0) * this.tick, w : this.size.x - 2, h : (this.size.y - 2) - (this.time | 0) * this.tick });

    ctx.restore();
  };

  Timer.prototype.add = function(seconds, cb) {
    if ((this.time - seconds) > 0) {
      this.time -= seconds;
    } else {
      this.time = 0;
    }

    cb('+' + seconds + ' SECS');
  };

  Timer.prototype.remove = function(seconds, cb) {
    this.tP = {
      from : this.time + seconds + 0.8,
      to : seconds,
      end : this.time
    };
    this.time += seconds;

    cb('-' + seconds + ' SECS');
  };

  Timer.prototype.pause = function(p) {
    this.paused = p;
    if (this.paused) {
      this.pausedAt = +new Date();
    } else {
      this.sT += (+new Date() - this.pausedAt);
    }
  }

  return Timer;

})();