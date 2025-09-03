const Pokemon = require('./pokemon');
const Move = require('./move');

// Battle class to handle Pokemon battles
class Battle {
  constructor(player1Pokemon, player2Pokemon) {
    this.player1 = {
      name: 'Player 1',
      pokemon: player1Pokemon,
      currentPokemon: 0
    };
    this.player2 = {
      name: 'Player 2', 
      pokemon: player2Pokemon,
      currentPokemon: 0
    };
    this.turn = 1;
    this.battleLog = [];
    this.winner = null;
  }

  // Get current active Pokemon for each player
  getCurrentPokemon(player) {
    return player.pokemon[player.currentPokemon];
  }

  // Start the battle
  async startBattle() {
    this.log('🥊 POKEMON BATTLE BEGINS! 🥊');
    this.log('='.repeat(50));
    
    const p1Pokemon = this.getCurrentPokemon(this.player1);
    const p2Pokemon = this.getCurrentPokemon(this.player2);
    
    this.log(`${this.player1.name} sends out ${p1Pokemon.name}!`);
    this.log(`${this.player2.name} sends out ${p2Pokemon.name}!`);
    this.log('');

    // Battle loop
    while (!this.winner) {
      await this.executeTurn();
      
      // Check for battle end
      if (this.checkBattleEnd()) {
        break;
      }
      
      this.turn++;
    }

    this.log('='.repeat(50));
    this.log(`🏆 ${this.winner} wins the battle! 🏆`);
    return this.winner;
  }

  // Execute a single turn
  async executeTurn() {
    this.log(`--- Turn ${this.turn} ---`);
    
    const p1Pokemon = this.getCurrentPokemon(this.player1);
    const p2Pokemon = this.getCurrentPokemon(this.player2);

    // Both Pokemon are active, determine turn order by speed
    let firstPokemon, secondPokemon, firstPlayer, secondPlayer;
    
    if (p1Pokemon.speed >= p2Pokemon.speed) {
      firstPokemon = p1Pokemon;
      secondPokemon = p2Pokemon;
      firstPlayer = this.player1;
      secondPlayer = this.player2;
    } else {
      firstPokemon = p2Pokemon;
      secondPokemon = p1Pokemon;
      firstPlayer = this.player2;
      secondPlayer = this.player1;
    }

    // First Pokemon attacks
    if (firstPokemon.canBattle()) {
      const moveIndex = this.selectMove(firstPokemon);
      const result = firstPokemon.useMove(moveIndex, secondPokemon);
      this.log(result.message);
      
      if (result.damage > 0) {
        this.log(`${secondPokemon.name} takes ${result.damage} damage!`);
      }
    }

    // Check if second Pokemon is still alive
    if (secondPokemon.canBattle()) {
      const moveIndex = this.selectMove(secondPokemon);
      const result = secondPokemon.useMove(moveIndex, firstPokemon);
      this.log(result.message);
      
      if (result.damage > 0) {
        this.log(`${firstPokemon.name} takes ${result.damage} damage!`);
      }
    }

    // Display current status
    this.log('');
    this.log('Current Status:');
    this.log(p1Pokemon.getStatus());
    this.log('');
    this.log(p2Pokemon.getStatus());
    this.log('');
  }

  // AI move selection (random for now)
  selectMove(pokemon) {
    return Math.floor(Math.random() * pokemon.moves.length);
  }

  // Check if battle has ended
  checkBattleEnd() {
    const p1Pokemon = this.getCurrentPokemon(this.player1);
    const p2Pokemon = this.getCurrentPokemon(this.player2);

    if (!p1Pokemon.canBattle()) {
      this.log(`${p1Pokemon.name} fainted!`);
      this.winner = this.player2.name;
      return true;
    }

    if (!p2Pokemon.canBattle()) {
      this.log(`${p2Pokemon.name} fainted!`);
      this.winner = this.player1.name;
      return true;
    }

    return false;
  }

  // Log battle events
  log(message) {
    console.log(message);
    this.battleLog.push(message);
  }

  // Get battle summary
  getBattleSummary() {
    return {
      winner: this.winner,
      turns: this.turn,
      log: this.battleLog
    };
  }
}

module.exports = Battle;