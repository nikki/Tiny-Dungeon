TM.Audio = (function() {
  var context,
      format = '.' + (new Audio().canPlayType('audio/ogg') !== '' ? 'ogg' : 'mp3');

  var _Audio = {

    /**
     * Check for Web Audio API support
     */

    init : function() {
      try {
        // apparently still needed for Safari :/
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        // create an AudioContext
        context = new AudioContext();
        return true;
      } catch(e) {
        // API not supported
        console.log('Web Audio API not supported.');
      }
    },


    /**
     * Load a sound obj
     */

    loadSound : function(obj, callback) {
      var request = new XMLHttpRequest();
      request.open('GET', obj.src + format, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        // request.response is encoded... so decode it now
        context.decodeAudioData(request.response, function(buffer) {
          obj.buffer = buffer;
          callback && callback();
        }, function() {
          console.log('Error loading ' + obj.src);
        });
      }

      request.send();
    },


    /**
     * Loop through and load list of sounds
     */

    loadSounds : function(obj, callback) {
      var len = obj.length, i;

      // iterate over sounds obj
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          // load sound
          loadSound(obj[i], callback);
        }
      }
    },


    /**
     * Play a sound
     */

    playSound : function(obj, callback) {
      var source = context.createBufferSource();
      source.buffer = obj.buffer;

      // loop the audio?
      source.loop = obj.loop;

      // create a gain node
      obj.gainNode = context.createGain();

      // connect the source to the gain node
      source.connect(obj.gainNode);

      // set the gain (volume)
      obj.gainNode.gain.value = obj.volume;

      // connect gain node to destination
      obj.gainNode.connect(context.destination);

      // play sound
      source.start(0);
      callback && callback();
    }
  };


  /**
   * Init module early
   */
/*
  if (_Audio.init()) {
    return {
      loadSound : _Audio.loadSound,
      loadSounds : _Audio.loadSounds,
      playSound : _Audio.playSound
    }
  } else {
    return {
      loadSound : function() {},
      loadSounds : function() {},
      playSound : function() {}
    }
  }
*/
})();

/*
  var sounds = {
    laser : {
      src : 'audio/laser',
      volume : 1,
      loop : true
    },
    coin : {
      src : 'audio/coin'
    },
    explosion : {
      src : 'audio/explosion'
    }
  };

  loadSounds(sounds, function() {
    console.log('Music tracks loaded successfully.');
  });

  playSound(sounds.laser);

 */