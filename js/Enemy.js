TM.Enemy = (function() {
  var r = TM.Utils.rand;

  var settings = [
    {
      name : 'lasher',
      spell : 'earth',
      weakTo : 'air'
    },
    {
      name : 'imp',
      spell : 'fire',
      weakTo : 'water'
    },
    {
      name : 'banshee',
      spell : 'air',
      weakTo : 'earth'
    },
    {
      name : 'frostgiant',
      spell : 'water',
      weakTo : 'fire'
    }/*,
    {
      name : 'tribble',
      spell : 'cuteness'
    }*/
  ];

  function Enemy(o) {
    this.fov = 60;
    this.depth = o.depth;
    this.step = 0.5;
    this.stepTimer = 0;

    this.x = 0;
    this.y = 0;
    this.z = this.depth;

    this.type = r(0, settings.length - 1);
    this.name = settings[this.type].name;
    this.spell = settings[this.type].spell;
    this.weakTo = settings[this.type].weakTo;

    this.level = o.level;
    this.health = 10;
    this.strength = 10;

    this.image = TM.images['e_' + this.name];
    // this.image = TM.images['e_lasher'];
    this.w = this.image.width;
    this.h = this.image.height;
    this.attacking = false;
    this.dead = false;
  }

  Enemy.prototype.update = function(vel, seconds) {
    this.stepTimer += seconds;
    if (this.stepTimer > this.step) {
      this.z -= vel * seconds;
      this.stepTimer = 0;
    }
  };

  Enemy.prototype.render = function(sw, sh) {
    var scale = this.fov / (this.fov + this.z);

    var x = (this.x * scale) + (sw / 2);
    var y = (this.y * scale) + (sh / 2);

    ctx.drawImage(this.image, x - (this.w * scale) / 2, y - (this.h * scale) / 2, this.w * scale, this.h * scale);

    if (this.z < -this.fov) this.dead = true;
  };

  return Enemy;

})();