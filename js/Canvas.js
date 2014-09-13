TM.Canvas = (function() {
  var font = TM.Font;

  var Canvas = {
    init : function() {
      ctx.imageSmoothingEnabled = false;
      ctx.oImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.globalCompositeOperation = 'source-over';
    },

    drawText : function(o) {
      var f = font.getData(o.text), x, y, margin = 0;

      f.word.forEach(function(l, index) {
        ctx.drawImage(f.buffer, l.x, l.y, l.w, l.h, o.x + margin, o.y, l.w, l.h);
        margin += l.w;
      });
    },

    // canvas.fillRect({ c : 'green', x : 0, y : 0, w : 40, h : 80 });
    fillRect : function(o) {
      ctx.fillStyle = o.c;
      ctx.fillRect(o.x, o.y, o.w, o.h);
    }
  };

  return Canvas;

})();