TM.Canvas = (function() {
  var Canvas = {
    init : function() {
      // var prefixes = ['webkit', 'moz', 'o', ''];

      ctx.imageSmoothingEnabled = false;
      ctx.oImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
    },

    drawImage : function(img, x, y) {
      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.drawImage(img, x, y);
      ctx.restore();
      // canvas.drawImage(TM.images['scr_title'], 0, 0);
    },

    fillRect : function(o) {
      ctx.fillStyle = o.c;
      ctx.fillRect(o.x, o.y, o.w, o.h);
      // canvas.fillRect({ c : 'green', x : 0, y : 0, w : 40, h : 80 });
    },

    drawLine : function(o) {
      ctx.strokeStyle = o.c;
      ctx.lineWidth = 1;
      ctx.lineCap = 'square';
      ctx.beginPath();

      // orientation?
      if (o.o === 'h') { // horizontal
        ctx.moveTo(0, o.y);
        ctx.lineTo(o.x, o.y);
      } else { // vertical
        ctx.moveTo(o.x, 0);
        ctx.lineTo(o.x, o.y);
      }

      ctx.stroke();
    }
  };

  return Canvas;

})();

// http://jsfiddle.net/VAXrL/190/