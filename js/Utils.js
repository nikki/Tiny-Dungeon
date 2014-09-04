var TM = {
  w : 320,
  h : 480,
  s : 4,
  images : [
    'scr_title',
    'scr_game',
    't_earth',
    't_water',
    't_air',
    't_fire'
  ],
  currentScreen : 'game'
},

$ = function(selector) {
  return document.querySelector(selector);
},

c = $('#c'),
ctx = c.getContext('2d');

TM.Utils = (function() {
  var images = TM.images,
      len = images.length,
      obj = {},
      numLoaded = 0;

  var Utils = {
    loadImage : function(name) {
      img = new Image();
      img.src = 'img/' + name + '.png';
      img.onload = function() {
        numLoaded++;
        if (len === numLoaded) {
          TM.images = obj;
          TM.imagesLoaded = true;
        }
      };
      return img;
    },

    loadImages : function(callback) {
      var i = 0;

      // iterate over and load all images
      for (; i < len; i++) {
        obj[images[i]] = this.loadImage(images[i]);
      }
    },

    loadAllAssets : function() {
      var imagesLoaded, event;

      // load all images
      this.loadImages();

      // check if images are loaded yet
      imagesLoaded = function() {
        if (TM.imagesLoaded) {
          event = new CustomEvent('imagesLoaded');
          document.dispatchEvent(event);
        } else {
          setTimeout(imagesLoaded, 100)
        }
      };

      // init images loaded check
      setTimeout(imagesLoaded, 100);
    },

    rand : function(min, max) {
      return (Math.random() * (max - min + 1)) | 0 + min;
    }
  };

  return Utils;

})();