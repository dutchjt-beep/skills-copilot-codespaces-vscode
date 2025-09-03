// Pokemon class representing individual Pokemon with stats, moves, and abilities
class Pokemon {
  constructor(name, type1, type2, stats, moves, level = 50) {
    this.name = name;
    this.type1 = type1;
    this.type2 = type2 || null;
    this.level = level;
    this.moves = moves;
    
    // Base stats
    this.baseStats = stats;
    
    // Calculate actual stats based on level
    this.maxHP = Math.floor(((2 * stats.hp + 31) * level) / 100) + level + 10;
    this.hp = this.maxHP;
    this.attack = Math.floor(((2 * stats.attack + 31) * level) / 100) + 5;
    this.defense = Math.floor(((2 * stats.defense + 31) * level) / 100) + 5;
    this.speed = Math.floor(((2 * stats.speed + 31) * level) / 100) + 5;
    
    // Status conditions
    this.status = null; // null, 'sleep', 'paralysis', 'burn', 'freeze', 'poison'
    this.fainted = false;
  }

  // Get all types of this Pokemon
  getTypes() {
    return this.type2 ? [this.type1, this.type2] : [this.type1];
  }

  // Take damage
  takeDamage(damage) {
    this.hp = Math.max(0, this.hp - damage);
    if (this.hp === 0) {
      this.fainted = true;
    }
  }

  // Heal HP
  heal(amount) {
    this.hp = Math.min(this.maxHP, this.hp + amount);
    if (this.hp > 0) {
      this.fainted = false;
    }
  }

  // Check if Pokemon can battle
  canBattle() {
    return !this.fainted && this.hp > 0;
  }

  // Get HP percentage for display
  getHPPercentage() {
    return Math.round((this.hp / this.maxHP) * 100);
  }

  // Use a move
  useMove(moveIndex, target) {
    if (moveIndex < 0 || moveIndex >= this.moves.length) {
      throw new Error('Invalid move index');
    }
    
    const move = this.moves[moveIndex];
    return move.execute(this, target);
  }

  // Display Pokemon status
  getStatus() {
    const hpBar = '█'.repeat(Math.floor(this.getHPPercentage() / 5)) + 
                  '░'.repeat(20 - Math.floor(this.getHPPercentage() / 5));
    
    return `${this.name} (Lv.${this.level})
HP: ${this.hp}/${this.maxHP} [${hpBar}] ${this.getHPPercentage()}%
Type: ${this.type1}${this.type2 ? '/' + this.type2 : ''}
Status: ${this.status || 'Normal'}`;
  }
}

module.exports = Pokemon;