#!/usr/bin/env node

const Battle = require('./battle');
const { createSamplePokemon } = require('./pokemonData');

// Quick battle script - run specific Pokemon battles easily
function runQuickBattle(pokemon1Name, pokemon2Name) {
  const pokemon = createSamplePokemon();
  
  const p1 = pokemon[pokemon1Name.toLowerCase()];
  const p2 = pokemon[pokemon2Name.toLowerCase()];
  
  if (!p1 || !p2) {
    console.log('❌ Available Pokemon: pikachu, charizard, blastoise, venusaur, alakazam, golem');
    return;
  }

  console.log(`\n🔥 ${p1.name.toUpperCase()} VS ${p2.name.toUpperCase()} 🔥\n`);
  
  const battle = new Battle([p1], [p2]);
  return battle.startBattle();
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.log('Usage: node quickBattle.js <pokemon1> <pokemon2>');
    console.log('Example: node quickBattle.js charizard blastoise');
    console.log('\nAvailable Pokemon: pikachu, charizard, blastoise, venusaur, alakazam, golem');
  } else {
    runQuickBattle(args[0], args[1]);
  }
}

module.exports = runQuickBattle;