TM.Canvas = (function() {

  var Canvas = {
    init : function() {
      c.width = TM.w;
      c.height = TM.h;
      ctx.imageSmoothingEnabled = false;
    },

    // Canvas.fillRect({ c : 'green', x : 0, y : 0, w : 40, h : 80 });
    fillRect : function(o) {
      ctx.scale(TM.s, TM.s);
      ctx.fillStyle = o.c;
      ctx.fillRect(o.x, o.y, o.w, o.h);
    },

    drawImage : function(img) {
      ctx.scale(TM.s, TM.s);
      ctx.drawImage(img, 0, 0)
    }
  };

  return Canvas;

})();

// http://jsfiddle.net/VAXrL/190/