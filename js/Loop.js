TM.Loop = (function() {
  function Loop() {
    this.frame = this.frame.bind(this);
    this.lastTime = 0;
    this.cb = function() {};

    this.start = function(cb) {
      this.cb = cb;
      requestAnimationFrame(this.frame);
    };
  }

  Loop.prototype.frame = function(time) {
    var seconds = (time - this.lastTime) / 1000;
    this.lastTime = time;
    if (seconds < 0.2) this.cb(seconds);
    requestAnimationFrame(this.frame);
  };

  return new Loop;

})();