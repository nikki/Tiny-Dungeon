TM.Dungeon = (function() {
  var camera = TM.Camera;

  function Dungeon() {
    this.size = 32;
    this.grid = new Uint8Array(this.size * this.size);
    this.point = { x : 25.3, y : 0 };
    this.direction = Math.PI / 2;
    this.light = 0;

    for (var i = 0; i < this.size * this.size; i++) {
      this.grid[i] = Math.random() < 0.5 ? 1 : 0;
    }

    this.get = function(x, y) {
      x = x | 0;
      y = y | 0;

      if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1;
      return this.grid[y * this.size + x];
    };

    this.cast = function(angle, range) {
      var _this = this,
          sin = Math.sin(angle),
          cos = Math.cos(angle),
          noWall = { l2 : Infinity };

      return ray({ x : _this.point.x, y : _this.point.y, height : 0, distance : 0 });

      function ray(origin) {
        var sX = step(sin, cos, origin.x, origin.y),
            sY = step(cos, sin, origin.y, origin.x, true),
            next = sX.l2 < sY.l2 ? inspect(sX, 1, 0, origin.distance, sX.y) : inspect(sY, 0, 1, origin.distance, sY.x);

        if (next.distance > range) return [origin];
        return [origin].concat(ray(next));
      }

      function step(rise, run, x, y, inverted) {
        var dX, dY;
        if (run === 0) return noWall;

        dX = run > 0 ? ((x + 1) | 0) - x : Math.ceil(x - 1) - x;
        dY = dX * (rise / run);

        return {
          x : inverted ? y + dY : x + dX,
          y : inverted ? x + dX : y + dY,
          l2 : dX * dX + dY * dY
        }
      }

      function inspect(step, shiftX, shiftY, distance, offset) {
        var dX = cos < 0 ? shiftX : 0,
            dY = sin < 0 ? shiftY : 0;

        step.height = _this.get(step.x - dX, step.y - dY);
        step.distance = distance + Math.sqrt(step.l2);
        step.shading = shiftX ? (cos < 0 ? 2 : 0) : (sin < 0 ? 2 : 1);
        step.offset = offset - (offset | 0);
        return step;
      }
    };

    this.update = function(seconds) {
      // movement


      // lighting
      if (this.light > 0) {
        this.light = Math.max(this.light - 10 * seconds, 0);
      }
    };

    this.render = function() {
      this.drawWalls();
    };

    this.drawWalls = function() {
      var wall = 0, x, angle, ray;

      ctx.save();
      for (; wall < camera.res; wall++) {
        x = wall / camera.res - 0.5;
        angle = Math.atan2(x, camera.fov);
        ray = this.cast(this.direction + angle, camera.range);
        this.drawWall(wall, ray, angle);
      }
      ctx.restore();
    };

    this.drawWall = function(wall, ray, angle) {
      var texture = { width : 32 },
          left = (wall * camera.spacing) | 0,
          width = Math.ceil(camera.spacing),
          hit = -1,
          s, step, tX;

      while (++hit < ray.length && ray[hit].height <= 0);

      for (s = ray.length - 1; s >= 0; s--) {
        step = ray[s];

        if (s === hit) {
          tX = (texture.width * step.offset) | 0;
          wall = camera.project(step.height, angle, step.distance);

          ctx.globalAlpha = 1;
          ctx.fillStyle = 'green';
          ctx.fillRect(left, wall.top, width, wall.height);

          ctx.fillStyle = 'black';
          ctx.globalAlpha = Math.max((step.distance + step.shading) / camera.lightRange - this.light, 0);
          ctx.fillRect(left, wall.top, width, wall.height);
        }
      }
    }
  };

  return new Dungeon;

})();