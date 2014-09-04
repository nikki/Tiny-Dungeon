TM.Camera = (function() {
  function Camera() {
    this.res = 160;
    this.fov = 0.8;
    this.range = 8;
    this.spacing = TM.w / this.res;
    this.lightRange = 5;

    this.project = function(height, angle, distance) {
      var z = distance * Math.cos(angle),
          wallHeight = TM.h * height / z,
          bottom = (TM.h / 2) * (1 + 1 / z); // +ve = up, -ve = down

      return {
        top : bottom - wallHeight,
        height : wallHeight
      }
    };
  }

  return new Camera;

})();