// Move class representing Pokemon moves
class Move {
  constructor(name, type, power, accuracy, category, description, effect = null) {
    this.name = name;
    this.type = type;
    this.power = power; // 0 for status moves
    this.accuracy = accuracy; // percentage
    this.category = category; // 'physical', 'special', 'status'
    this.description = description;
    this.effect = effect; // function for special effects
  }

  // Execute the move
  execute(attacker, defender) {
    const result = {
      moveUsed: this.name,
      hit: false,
      damage: 0,
      critical: false,
      effectiveness: 1,
      message: `${attacker.name} used ${this.name}!`
    };

    // Check if move hits
    const hitChance = Math.random() * 100;
    if (hitChance > this.accuracy) {
      result.message += ` But it missed!`;
      return result;
    }

    result.hit = true;

    // Status moves
    if (this.category === 'status') {
      if (this.effect) {
        this.effect(attacker, defender, result);
      }
      return result;
    }

    // Calculate damage for attack moves
    if (this.power > 0) {
      result.damage = this.calculateDamage(attacker, defender);
      result.critical = Math.random() < 0.0625; // 1/16 chance for critical hit
      
      if (result.critical) {
        result.damage = Math.floor(result.damage * 2);
        result.message += ` A critical hit!`;
      }

      // Apply type effectiveness
      const types = defender.getTypes();
      result.effectiveness = this.getTypeEffectiveness(this.type, types);
      result.damage = Math.floor(result.damage * result.effectiveness);

      // Add effectiveness message
      if (result.effectiveness > 1) {
        result.message += ` It's super effective!`;
      } else if (result.effectiveness < 1 && result.effectiveness > 0) {
        result.message += ` It's not very effective...`;
      } else if (result.effectiveness === 0) {
        result.message += ` It doesn't affect ${defender.name}...`;
      }

      // Apply damage
      defender.takeDamage(result.damage);
    }

    // Apply special effects
    if (this.effect) {
      this.effect(attacker, defender, result);
    }

    return result;
  }

  // Calculate base damage
  calculateDamage(attacker, defender) {
    const attackStat = this.category === 'physical' ? attacker.attack : attacker.attack;
    const defenseStat = this.category === 'physical' ? defender.defense : defender.defense;
    
    // Simplified damage formula
    const level = attacker.level;
    const baseDamage = ((((2 * level / 5 + 2) * this.power * attackStat / defenseStat) / 50) + 2);
    
    // Add some randomness (85-100% of base damage)
    const randomFactor = (Math.random() * 0.15 + 0.85);
    
    // STAB (Same Type Attack Bonus)
    let stab = 1;
    if (attacker.type1 === this.type || attacker.type2 === this.type) {
      stab = 1.5;
    }

    return Math.floor(baseDamage * randomFactor * stab);
  }

  // Get type effectiveness multiplier
  getTypeEffectiveness(attackType, defenderTypes) {
    const effectiveness = {
      'normal': { 'rock': 0.5, 'ghost': 0, 'steel': 0.5 },
      'fire': { 'fire': 0.5, 'water': 0.5, 'grass': 2, 'ice': 2, 'bug': 2, 'rock': 0.5, 'dragon': 0.5, 'steel': 2 },
      'water': { 'fire': 2, 'water': 0.5, 'grass': 0.5, 'ground': 2, 'rock': 2, 'dragon': 0.5 },
      'electric': { 'water': 2, 'electric': 0.5, 'grass': 0.5, 'ground': 0, 'flying': 2, 'dragon': 0.5 },
      'grass': { 'fire': 0.5, 'water': 2, 'grass': 0.5, 'poison': 0.5, 'ground': 2, 'flying': 0.5, 'bug': 0.5, 'rock': 2, 'dragon': 0.5, 'steel': 0.5 },
      'ice': { 'fire': 0.5, 'water': 0.5, 'grass': 2, 'ice': 0.5, 'ground': 2, 'flying': 2, 'dragon': 2, 'steel': 0.5 },
      'fighting': { 'normal': 2, 'ice': 2, 'poison': 0.5, 'flying': 0.5, 'psychic': 0.5, 'bug': 0.5, 'rock': 2, 'ghost': 0, 'dark': 2, 'steel': 2, 'fairy': 0.5 },
      'poison': { 'grass': 2, 'poison': 0.5, 'ground': 0.5, 'rock': 0.5, 'ghost': 0.5, 'steel': 0, 'fairy': 2 },
      'ground': { 'fire': 2, 'electric': 2, 'grass': 0.5, 'poison': 2, 'flying': 0, 'bug': 0.5, 'rock': 2, 'steel': 2 },
      'flying': { 'electric': 0.5, 'grass': 2, 'ice': 0.5, 'fighting': 2, 'bug': 2, 'rock': 0.5, 'steel': 0.5 },
      'psychic': { 'fighting': 2, 'poison': 2, 'psychic': 0.5, 'dark': 0, 'steel': 0.5 },
      'bug': { 'fire': 0.5, 'grass': 2, 'fighting': 0.5, 'poison': 0.5, 'flying': 0.5, 'psychic': 2, 'ghost': 0.5, 'dark': 2, 'steel': 0.5, 'fairy': 0.5 },
      'rock': { 'fire': 2, 'ice': 2, 'fighting': 0.5, 'ground': 0.5, 'flying': 2, 'bug': 2, 'steel': 0.5 },
      'ghost': { 'normal': 0, 'psychic': 2, 'ghost': 2, 'dark': 0.5 },
      'dragon': { 'dragon': 2, 'steel': 0.5, 'fairy': 0 },
      'dark': { 'fighting': 0.5, 'psychic': 2, 'ghost': 2, 'dark': 0.5, 'fairy': 0.5 },
      'steel': { 'fire': 0.5, 'water': 0.5, 'electric': 0.5, 'ice': 2, 'rock': 2, 'steel': 0.5, 'fairy': 2 },
      'fairy': { 'fire': 0.5, 'fighting': 2, 'poison': 0.5, 'dragon': 2, 'dark': 2, 'steel': 0.5 }
    };

    let totalEffectiveness = 1;
    
    for (const defenderType of defenderTypes) {
      if (effectiveness[attackType] && effectiveness[attackType][defenderType] !== undefined) {
        totalEffectiveness *= effectiveness[attackType][defenderType];
      }
    }

    return totalEffectiveness;
  }
}

module.exports = Move;