TM.Enemy = (function() {
  var r = TM.Utils.randInt;

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
    }
  ];

  function Enemy(o) {
    this.x = 0;
    this.y = 0;
    this.z = r(300, 450);
    this.fov = 60;
    this.step = 0.25;
    this.stepTimer = 0;

    this.type = r(0, settings.length - 1);
    this.name = settings[this.type].name;
    this.spell = settings[this.type].spell;
    this.weakTo = settings[this.type].weakTo;

    this.level = o.level;
    this.baseHealth = 10 + (this.level * 4);
    this.health = this.baseHealth;
    this.strength = this.level * 2;
    this.critChance = this.level + 10;

    this.attacking = false;
    this.attackFor = 0;
    this.lastAttacked = null;

    this.image = TM.images['e_' + this.name];
    this.w = this.image.width;
    this.h = this.image.height;
    this.dead = false;
  }

  Enemy.prototype.drawHealthMeter = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(2, 2, 20, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(3, 3, 18, 2);
    ctx.fillStyle = 'red';
    ctx.fillRect(3, 3, 18 * (this.health / this.baseHealth), 2);
  };

  Enemy.prototype.hit = function(o, callback) {
    var base = 1, damage = 0, text = ' HP';

    if (o.spell === this.spell) {
      base = 0;
      text = ' HP *IMMUNE*';
    } else if (o.spell === this.weakTo) {
      base = 2;
      text = ' HP *CRIT!*';
    }

    damage = base * o.strength; // * level multiplier

    this.health -= damage;
    callback(!!(base === 2), damage, '-' + damage + text);
  };

  Enemy.prototype.update = function(vel, seconds) {
    // position update
    this.stepTimer += seconds;
    if (this.stepTimer > this.step) {
      this.z -= vel * seconds;
      this.stepTimer = 0;
    }

    // attacking?
    if (this.attacking) {
      this.attackFor -= seconds;
      if (this.attackFor < 0) this.attacking = false;
    } else {
      this.lastAttacked += seconds;
    }

    // dead?
    if (this.health <= 0) this.dead = true;
  };

  Enemy.prototype.render = function(sw, sh) {
    var scale = this.fov / (this.fov + this.z);
    var x = (this.x * scale) + (sw / 2);
    var y = (this.y * scale) + (sh / 2);

    // too far away to draw!
    if (this.z > 200) return;

    // alive?
    if (!this.dead) {
      // draw sprite
      ctx.globalAlpha = 1 - this.z / 200;
      ctx.drawImage(this.image, x - (this.w * scale) / 2, y - (this.attacking ? 2 : 0) - (this.h * scale) / 2, this.w * scale, this.h * scale);
      ctx.globalAlpha = 1;

      if (TM.wait) {
        // draw health meter
        this.drawHealthMeter();

        // draw name
        ctx.fillStyle = 'white';
        ctx.fillRect(sw / 2 - 15, sh - 9, 30, 7);
        ctx.fillStyle = 'black';
        ctx.fillRect(sw / 2 - 14, sh - 8, 28, 5);
      }
    }
  };

  return Enemy;

})();