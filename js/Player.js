TM.Player = (function() {
  var Stats = TM.Stats;

  function Player() {
    this.pos = 0; // dungeon pos
    this.baseVel = 1000;
    this.currentVel = 1000;

    this.step = 0.25;
    this.stepTimer = 0; // head bob
    this.defending = false;

    this.mage = TM.images['p_mage'];
    this.mx = 38;
    this.my = 11;
    this.mw = this.mage.width;
    this.mh = this.mage.height;

    this.staff = TM.images['p_staff'];
    this.sx = 50;
    this.sy = 16;
    this.sw = this.staff.width;
    this.sh = this.staff.height;
    this.rotate = 0;

    // stats
    this.stats = new Stats;
  }

  Player.prototype.update = function(seconds) {
    // update dungeon pos
    this.defending = TM.wait;
    this.currentVel = this.defending ? 0 : this.baseVel;
    this.pos += this.currentVel;

    // headbob
    this.stepTimer += seconds;
    if (this.stepTimer >= this.step * 2 || this.defending) {
      this.stepTimer = 0;
    }
  };

  Player.prototype.render = function() {
    if (!this.defending) {
      // draw mage
      ctx.drawImage(this.mage, this.mx, this.my + (this.stepTimer >= this.step ? 1 : 0), this.mw, this.mh);

    } else {
      // draw staff
      if (this.rotate !== 0) {
        ctx.save();
        ctx.translate(0, this.h);
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.drawImage(this.staff, this.sx + this.rotate, (this.sy - this.rotate) + (this.stepTimer >= this.step ? 1 : 0), this.sw, this.sh);
        ctx.restore();
      } else {
        ctx.drawImage(this.staff, this.sx, this.sy + (this.stepTimer >= this.step ? 1 : 0), this.sw, this.sh);
      }
    }
  };

  Player.prototype.castAnimation = function() {
    var _this = this;

    var a = new TWEEN.Tween({ r : 0 })
        .to({ r : -10 }, 200)
        .easing(TWEEN.Easing.Quintic.In)
        .onUpdate(function() {
          _this.rotate = this.r;
        });

    var b = new TWEEN.Tween({ r : -10 })
        .to({ r : 0 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function() {
          _this.rotate = this.r;
        });

    a.chain(b).start();
  };

  return Player;

})();