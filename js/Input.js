TM.Input = (function(w, d) {
  var game = TM.Game;

  var inputHandlers = {};

  var Input = {
    init : function() {
      this.bind('start', game.start);
      this.bind('pause', game.pause);
      this.bind('first', game.first);
      this.bind('next', game.next);
      this.bind('last', game.last);
    },

    bind : function(action, handler) {
      if (!inputHandlers[action]) inputHandlers[action] = [];
      inputHandlers[action].push(handler);
    },

    trigger : function(action, event) {
      var handlers = inputHandlers[action],
          args = Array.prototype.slice.call(arguments, 1),
          len, i;

      if (handlers) {
        len = handlers.length;
        for (i = 0; i < len; i++) {
          handlers[i].apply(game, args); // cheeky!
        }
      }
    }
  };

  Input.init();
  return Input;

})();