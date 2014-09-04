TM.Loop = (function() {
  function Loop() {
    this.frame = this.frame.bind(this);
    this.lastTime = 0;
    this.callback = function() {};

    this.start = function(callback) {
      this.callback = callback;
      requestAnimationFrame(this.frame);
    };
  }

  Loop.prototype.frame = function(time) {
    var seconds = (time - this.lastTime) / 1000;
    this.lastTime = time;
    if (seconds < 0.2) this.callback(seconds);
    requestAnimationFrame(this.frame);
  };

  return new Loop;

})();