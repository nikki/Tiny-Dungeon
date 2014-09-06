TM.Canvas = (function() {
  var Canvas = {
    init : function() {
      // var prefixes = ['webkit', 'moz', 'o', ''];

      ctx.imageSmoothingEnabled = false;
      ctx.oImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
    },

    drawImage : function(o) {

    },

    // canvas.drawImageScaled({ img : TM.images['scr_title'], x : 0, y : 0 });
    drawImageScaled : function(o) {
      ctx.save();
      ctx.scale(TM.s, TM.s);
      ctx.drawImage(o.img, o.x, o.y);
      ctx.restore();

    },

    // canvas.fillRect({ c : 'green', x : 0, y : 0, w : 40, h : 80 });
    fillRect : function(o) {
      ctx.fillStyle = o.c;
      ctx.fillRect(o.x, o.y, o.w, o.h);
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

    polygon : function(o) {
      // x1, y1, x2, y2, x3, y3, x4, y4, color

      // ctx.fillStyle = o.c;
      // ctx.beginPath();
      // ctx.moveTo(o.x1, o.y1);
      // ctx.lineTo(o.x2, o.y2);
      // ctx.lineTo(o.x3, o.y3);
      // ctx.lineTo(o.x4, o.y4);
      // ctx.closePath();
      // ctx.fill();
    },

    segment : function(x1, y1, w1, x2, y2, w2, c) {
      // this.polygon(x1-w1, y1, x1+w1, y1, x2+w2, y2, x2-w2, y2, c);
    }
  };

  return Canvas;

})();

// http://jsfiddle.net/VAXrL/190/