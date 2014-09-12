TM.Canvas = (function() {
  var font = TM.Font;

  var Canvas = {
    init : function() {
      // var prefixes = ['webkit', 'moz', 'o', ''];

      ctx.imageSmoothingEnabled = false;
      ctx.oImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;

      ctx.globalCompositeOperation = 'source-over';
    },

    // canvas.drawImageScaled({ img : TM.images['scr_title'], x : 0, y : 0 });
    drawImageScaled : function(o) {
      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.drawImage(o.img, o.x, o.y);
      ctx.restore();
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
    },

    polygon : function(o) {
      ctx.fillStyle = o.c;
      ctx.beginPath();
      ctx.moveTo(o.x1, o.y1);
      ctx.lineTo(o.x1 + o.w1, o.y1 + o.h1);
      ctx.lineTo(o.x2 + o.w2, o.y2 + o.h2);
      ctx.lineTo(o.x2, o.y2);
      ctx.closePath();
      ctx.fill();
    }
  };

  return Canvas;

})();

// http://jsfiddle.net/VAXrL/190/