TM.Font = (function() {

  var buffer = document.createElement('canvas').getContext('2d'),
      chars = [];

  var Font = {
    init : function() {
      var i, x, y, img = TM.images['font'],
          w = img.width, h = img.height,
          data, lastX = 0;

      // composite buffer
      buffer.canvas.width = w;
      buffer.canvas.height = h;
      buffer.drawImage(img, 0, 0, w, h);
      data = buffer.getImageData(0, 0, w, h).data;

      for (i = 0; i < data.length; i += 4) {
        x = ((i / 4) % w) | 0;
        y = ((i / 4) / w) | 0;

        // y pos is 8, alpha pixel is transparent
        if (y === (h - 1) && !data[i + 3]) {
          chars.push({
            x : lastX,
            y : 0,
            w : x - lastX,
            h : h - 1
          });
          lastX = x + 1; // set next lastX
          i += 4; // skip to next pixel
        }
      }
    },

    getData : function(text) {
      var i, len = text.length, word = [];

      for (i = 0; i < len; i++) {
        word.push(chars[text.charCodeAt(i) - 32]);
      }

      return {
        buffer : buffer.canvas,
        word : word
      }
    }
  };

  return Font;

})();