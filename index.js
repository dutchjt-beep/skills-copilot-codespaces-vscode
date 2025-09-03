#!/usr/bin/env node

const Battle = require('./battle');
const { createSamplePokemon } = require('./pokemonData');

// Main CLI interface for the Pokemon Battle Simulator
class PokemonBattleSimulator {
  constructor() {
    this.pokemon = createSamplePokemon();
  }

  // Display welcome message
  displayWelcome() {
    console.log('\n🎮 POKEMON BATTLE SIMULATOR 🎮');
    console.log('='.repeat(40));
    console.log('Welcome to the ultimate Pokemon battle experience!');
    console.log('Choose your Pokemon and battle against opponents!\n');
  }

  // Display available Pokemon
  displayAvailablePokemon() {
    console.log('Available Pokemon:');
    console.log('-'.repeat(30));
    const pokemonList = Object.values(this.pokemon);
    
    pokemonList.forEach((pokemon, index) => {
      console.log(`${index + 1}. ${pokemon.name} (${pokemon.type1}${pokemon.type2 ? '/' + pokemon.type2 : ''}) - Level ${pokemon.level}`);
      console.log(`   HP: ${pokemon.maxHP}, Attack: ${pokemon.attack}, Defense: ${pokemon.defense}, Speed: ${pokemon.speed}`);
      console.log(`   Moves: ${pokemon.moves.map(move => move.name).join(', ')}`);
      console.log();
    });
  }

  // Simulate a quick battle
  async runQuickBattle() {
    console.log('🎲 Running a quick battle with random Pokemon...\n');
    
    const pokemonArray = Object.values(this.pokemon);
    
    // Select random Pokemon for each player
    const p1Index = Math.floor(Math.random() * pokemonArray.length);
    let p2Index = Math.floor(Math.random() * pokemonArray.length);
    
    // Ensure different Pokemon
    while (p2Index === p1Index) {
      p2Index = Math.floor(Math.random() * pokemonArray.length);
    }

    const player1Pokemon = pokemonArray[p1Index];
    const player2Pokemon = pokemonArray[p2Index];

    // Create fresh copies with full HP
    const p1Copy = this.createFreshCopy(player1Pokemon);
    const p2Copy = this.createFreshCopy(player2Pokemon);

    console.log(`🔥 ${p1Copy.name} VS ${p2Copy.name} 🔥\n`);

    // Start battle
    const battle = new Battle([p1Copy], [p2Copy]);
    const winner = await battle.startBattle();

    return winner;
  }

  // Create a fresh copy of a Pokemon with full HP
  createFreshCopy(originalPokemon) {
    const copy = new (originalPokemon.constructor)(
      originalPokemon.name,
      originalPokemon.type1,
      originalPokemon.type2,
      originalPokemon.baseStats,
      originalPokemon.moves,
      originalPokemon.level
    );
    return copy;
  }

  // Run specific matchup
  async runSpecificBattle(pokemon1Name, pokemon2Name) {
    const p1 = this.pokemon[pokemon1Name.toLowerCase()];
    const p2 = this.pokemon[pokemon2Name.toLowerCase()];

    if (!p1 || !p2) {
      console.log('❌ One or both Pokemon not found!');
      return null;
    }

    const p1Copy = this.createFreshCopy(p1);
    const p2Copy = this.createFreshCopy(p2);

    console.log(`\n🔥 ${p1Copy.name} VS ${p2Copy.name} 🔥\n`);

    const battle = new Battle([p1Copy], [p2Copy]);
    const winner = await battle.startBattle();

    return winner;
  }

  // Run multiple battles and show statistics
  async runTournament(rounds = 5) {
    console.log(`\n🏆 POKEMON TOURNAMENT - ${rounds} ROUNDS 🏆\n`);
    
    const results = {};
    const pokemonNames = Object.keys(this.pokemon);
    
    // Initialize results
    pokemonNames.forEach(name => {
      results[name] = { wins: 0, losses: 0, battles: 0 };
    });

    for (let round = 1; round <= rounds; round++) {
      console.log(`\n--- Round ${round} ---`);
      
      // Shuffle and pair Pokemon
      const shuffled = [...pokemonNames].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        const p1Name = shuffled[i];
        const p2Name = shuffled[i + 1];
        
        const p1 = this.createFreshCopy(this.pokemon[p1Name]);
        const p2 = this.createFreshCopy(this.pokemon[p2Name]);
        
        console.log(`\nBattle: ${p1.name} vs ${p2.name}`);
        
        const battle = new Battle([p1], [p2]);
        const winner = await battle.startBattle();
        
        // Update results
        if (winner === 'Player 1') {
          results[p1Name].wins++;
          results[p2Name].losses++;
        } else {
          results[p2Name].wins++;
          results[p1Name].losses++;
        }
        
        results[p1Name].battles++;
        results[p2Name].battles++;
        
        console.log(`Winner: ${winner === 'Player 1' ? p1.name : p2.name}`);
      }
    }

    // Display tournament results
    console.log('\n🏆 TOURNAMENT RESULTS 🏆');
    console.log('='.repeat(50));
    
    const sortedResults = Object.entries(results)
      .sort(([,a], [,b]) => (b.wins / b.battles) - (a.wins / a.battles));
    
    sortedResults.forEach(([pokemonName, stats], index) => {
      const winRate = stats.battles > 0 ? ((stats.wins / stats.battles) * 100).toFixed(1) : 0;
      console.log(`${index + 1}. ${pokemonName}: ${stats.wins}W-${stats.losses}L (${winRate}% win rate)`);
    });
  }

  // Main menu
  async start() {
    this.displayWelcome();
    
    console.log('What would you like to do?');
    console.log('1. View available Pokemon');
    console.log('2. Run a quick random battle');
    console.log('3. Run a specific battle (Charizard vs Blastoise)');
    console.log('4. Run a tournament (multiple battles)');
    console.log('5. Run all classic starter battles\n');

    // For demo purposes, let's run all options
    console.log('🎮 Running full demonstration...\n');

    // Show available Pokemon
    this.displayAvailablePokemon();

    // Quick battle
    await this.runQuickBattle();

    // Specific battle
    await this.runSpecificBattle('charizard', 'blastoise');

    // Classic starter battles
    console.log('\n🔥 CLASSIC STARTER BATTLES 🔥');
    await this.runSpecificBattle('charizard', 'venusaur');
    await this.runSpecificBattle('blastoise', 'venusaur');
    await this.runSpecificBattle('charizard', 'blastoise');

    // Mini tournament
    await this.runTournament(3);

    console.log('\n✨ Thanks for playing Pokemon Battle Simulator! ✨');
  }
}

// Run the simulator if this file is executed directly
if (require.main === module) {
  const simulator = new PokemonBattleSimulator();
  simulator.start().catch(console.error);
}

module.exports = PokemonBattleSimulator;