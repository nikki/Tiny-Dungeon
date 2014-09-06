TM.Dom = (function(w, d) {
  var utils = TM.Utils,
      input = TM.Input,
      game = TM.Game;

  var keys = {
    37 : 'LEFT',
    38 : 'UP',
    39 : 'RIGHT',
    40 : 'DOWN'
  },

  gestures = {
    LEFT : { x : -1, y : 0 },
    UP : { x : 0, y : -1 },
    RIGHT : { x : 1, y : 0 },
    DOWN : { x : 0, y : 1 }
  },

  controls = {
    LEFT : 'move',
    UP : 'move',
    RIGHT : 'move',
    DOWN : 'move'
  };

  var Dom = {
    init : function() {
      var sx, sy, pressed = false;

      this.bind(d, 'DOMContentLoaded', utils.loadAllAssets.call(utils));
      this.bind(d, 'imagesLoaded', game.init);
      this.bind(d, 'gameStart', game.start);
      this.bind(d, 'gameEnd', game.end);

      this.bind(c, 'mousedown', function(e) {
        input.trigger('firstInChain', { x : e.layerX, y : e.layerY });
        pressed = true;
        e.preventDefault();
      });

      this.bind(c, 'mousemove', function(e) {
        if (pressed) {
          input.trigger('nextInChain', { x : e.layerX, y : e.layerY });
        }
        e.preventDefault();
      });

      this.bind(c, 'mouseup', function(e) {
        input.trigger('lastInChain', { x : e.layerX, y : e.layerY });
        pressed = false;
        e.preventDefault();
      });


/*
      this.bind(d, 'touchstart', function(e) {
        if (e.touches.length > 1) return;

        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;

        e.preventDefault();
      });

      // touchmove

      this.bind(d, 'touchend', function(e) {
        var x, y, dX, dY;
        if (e.touches.length > 0) return;

        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
        dx = x - sx;
        dy = y - sy;
        absDx = Math.abs(dx);
        absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
          input.trigger('move', absDx > absDy ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        }

        e.preventDefault();
      });
*/
    },

    // bind dom events
    bind : function(el, event, handler) {
      if (typeof el === 'string') el = $(el);
      if (event.indexOf(' ') >= 0) {
        event = event.split(' ');
      } else {
        event = [event];
      }

      // bind dom events
      event.forEach(function(e) {
        el.addEventListener(e, handler, false)
      });
    }
  };

  Dom.init();
  return Dom;

})(window, document);