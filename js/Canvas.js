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

    segment : function(x1, y1, w1, x2, y2, w2, c) {
      this.polygon(x1, y1, x1+w1, y1, x2+w2, y2, x2, y2, c);
    },

    polygon : function(x1, y1, x2, y2, x3, y3, x4, y4, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.fill();
    }
  };

  return Canvas;

})();