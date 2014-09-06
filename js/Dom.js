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
      var pressed = false,
          touch = !!('ontouchstart' in window);

      function getClientPos(e, maxTouches) {
        var x, y;

        if (TM.currentScreen !== 'game') return;
        if (touch && e.touches) {
          if (e.touches.length > maxTouches) return;
          x = e[maxTouches ? 'touches' : 'changedTouches'][0].clientX;
          y = e[maxTouches ? 'touches' : 'changedTouches'][0].clientY;
        } else {
          x = e.clientX;
          y = e.clientY;
        }

        return { x : x, y : y };
      }

      this.bind(d, 'DOMContentLoaded', utils.loadAllAssets.call(utils));
      this.bind(d, 'imagesLoaded', game.init);
      this.bind(d, 'gameStart', game.start);
      this.bind(d, 'gameEnd', game.end);

      this.bind(d, 'mousedown touchstart', function(e) {
        var p = getClientPos(e, 1);

        if (TM.currentScreen !== 'game') {
          TM.currentScreen = 'game';
          return;
        }

        input.trigger('firstInChain', { x : p.x, y : p.y });
        pressed = true;
        e.preventDefault();
      });

      this.bind(d, 'mousemove touchmove', function(e) {
        var p = getClientPos(e, 1);

        if (pressed) input.trigger('nextInChain', { x : p.x, y : p.y });
        e.preventDefault();
      });

      this.bind(d, 'mouseup touchend', function(e) {
        var p = getClientPos(e, 0);

        input.trigger('lastInChain', { x : p.x, y : p.y });
        pressed = false;
        e.preventDefault();
      });

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