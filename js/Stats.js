TM.Stats = (function() {

  function Stats() {
    this.level = 0;
    this.highestCrit = {
      amount : 0,
      enemy : '' // enemy name
    };
    this.mostDamageTaken = {
      amount : 0,
      enemy : '' // enemy name
    };
    this.longestSpellChain = 0;
    this.damageTakenOverall = 0;
    this.totalEnemiesKilled = 0;
    this.totalTimeSurvived = 0;
  }

  Stats.prototype.update = function(name, value) {
    if (this.hasOwnProperty(name)) {
      if (typeof value === 'number' && value > this[name]) {
        this[name] = value;
      } else if (typeof value === 'object') {
        if (value.amount > this[name].amount) {
          this[name] = value;
        }
      }
    }

    // console.log(this.totalTimeSurvived);
  };

  return Stats;

})();