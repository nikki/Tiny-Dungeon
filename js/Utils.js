var TM = {
  w : 320,
  h : 480,
  s : 4,
  images : [
    'font',
    't_earth',
    't_water',
    't_air',
    't_fire',
    'p_mage',
    'p_staff',
    'e_lasher',
    'e_imp',
    'e_frostgiant',
    'bg'
  ],
  cS : 'title',
  timer : null,
  wait : false
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
      n = 0;

  var Utils = {
    lImg : function(name) {
      img = new Image();
      img.src = 'img/' + name + '.png';
      img.onload = function() {
        n++;
        if (len === n) {
          TM.images = obj;
          TM.imgsL = true;
        }
      };
      return img;
    },

    lImgs : function(cb) {
      var i = 0;

      // iterate over and load all images
      for (; i < len; i++) {
        obj[images[i]] = this.lImg(images[i]);
      }
    },

    lAssets : function() {
      var imgsL, event;

      // load all images
      this.lImgs();

      // check if images are loaded yet
      imgsL = function() {
        if (TM.imgsL) {
          event = new CustomEvent('imgsL');
          document.dispatchEvent(event);
        } else {
          setTimeout(imgsL, 100)
        }
      };

      // init images loaded check
      setTimeout(imgsL, 100);
    },

    r : function(min, max) {
      return (Math.random() * (max - min + 1)) | 0 + min;
    }
  };

  return Utils;

})();