const Pokemon = require('./pokemon');
const Move = require('./move');
const Battle = require('./battle');
const { createSamplePokemon } = require('./pokemonData');

// Simple test suite for the Pokemon Battle Simulator
class PokemonBattleTests {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  // Add a test
  test(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  // Assert function
  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  // Run all tests
  async runTests() {
    console.log('🧪 Running Pokemon Battle Simulator Tests...\n');

    for (const test of this.tests) {
      try {
        await test.testFunction();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    
    if (this.failed === 0) {
      console.log('🎉 All tests passed!');
    }
  }
}

// Create test instance
const tester = new PokemonBattleTests();

// Test Pokemon creation
tester.test('Pokemon creation and stats', () => {
  const pikachu = new Pokemon('Pikachu', 'electric', null, {
    hp: 35, attack: 55, defense: 40, speed: 90
  }, [], 25);

  tester.assert(pikachu.name === 'Pikachu', 'Pokemon name should be Pikachu');
  tester.assert(pikachu.type1 === 'electric', 'Primary type should be electric');
  tester.assert(pikachu.type2 === null, 'Secondary type should be null');
  tester.assert(pikachu.level === 25, 'Level should be 25');
  tester.assert(pikachu.hp > 0, 'HP should be greater than 0');
  tester.assert(pikachu.canBattle() === true, 'Fresh Pokemon should be able to battle');
});

// Test damage and fainting
tester.test('Pokemon damage and fainting', () => {
  const testPokemon = new Pokemon('Test', 'normal', null, {
    hp: 50, attack: 50, defense: 50, speed: 50
  }, [], 50);

  const initialHP = testPokemon.hp;
  testPokemon.takeDamage(20);
  
  tester.assert(testPokemon.hp === initialHP - 20, 'Pokemon should take correct damage');
  tester.assert(testPokemon.canBattle() === true, 'Pokemon should still be able to battle');

  // Faint the Pokemon
  testPokemon.takeDamage(testPokemon.hp);
  tester.assert(testPokemon.hp === 0, 'Pokemon HP should be 0');
  tester.assert(testPokemon.fainted === true, 'Pokemon should be fainted');
  tester.assert(testPokemon.canBattle() === false, 'Fainted Pokemon should not be able to battle');
});

// Test Move creation and execution
tester.test('Move creation and execution', () => {
  const tackle = new Move('Tackle', 'normal', 40, 100, 'physical', 'A basic attack');
  
  tester.assert(tackle.name === 'Tackle', 'Move name should be Tackle');
  tester.assert(tackle.power === 40, 'Move power should be 40');
  tester.assert(tackle.accuracy === 100, 'Move accuracy should be 100');

  // Test move execution
  const attacker = new Pokemon('Attacker', 'normal', null, {
    hp: 100, attack: 100, defense: 50, speed: 50
  }, [tackle], 50);

  const defender = new Pokemon('Defender', 'normal', null, {
    hp: 100, attack: 50, defense: 50, speed: 50
  }, [], 50);

  const initialDefenderHP = defender.hp;
  const result = tackle.execute(attacker, defender);

  tester.assert(result.hit === true, 'Move should hit at 100% accuracy');
  tester.assert(result.damage > 0, 'Move should deal damage');
  tester.assert(defender.hp < initialDefenderHP, 'Defender should have taken damage');
});

// Test type effectiveness
tester.test('Type effectiveness', () => {
  const fireMove = new Move('Ember', 'fire', 40, 100, 'special', 'Fire attack');
  const grassPokemon = new Pokemon('Grass Pokemon', 'grass', null, {
    hp: 100, attack: 50, defense: 50, speed: 50
  }, [], 50);

  // Fire is super effective against grass
  const effectiveness = fireMove.getTypeEffectiveness('fire', ['grass']);
  tester.assert(effectiveness === 2, 'Fire should be super effective against grass');

  // Water vs fire
  const waterEffectiveness = fireMove.getTypeEffectiveness('water', ['fire']);
  tester.assert(waterEffectiveness === 2, 'Water should be super effective against fire');

  // Normal vs ghost
  const normalEffectiveness = fireMove.getTypeEffectiveness('normal', ['ghost']);
  tester.assert(normalEffectiveness === 0, 'Normal should have no effect on ghost');
});

// Test sample Pokemon creation
tester.test('Sample Pokemon creation', () => {
  const samplePokemon = createSamplePokemon();
  
  tester.assert(samplePokemon.pikachu instanceof Pokemon, 'Pikachu should be a Pokemon instance');
  tester.assert(samplePokemon.charizard instanceof Pokemon, 'Charizard should be a Pokemon instance');
  tester.assert(samplePokemon.blastoise instanceof Pokemon, 'Blastoise should be a Pokemon instance');
  
  tester.assert(samplePokemon.pikachu.moves.length > 0, 'Pikachu should have moves');
  tester.assert(samplePokemon.charizard.type1 === 'fire', 'Charizard should be fire type');
  tester.assert(samplePokemon.blastoise.type1 === 'water', 'Blastoise should be water type');
});

// Test battle creation and basic functionality
tester.test('Battle creation and setup', async () => {
  const samplePokemon = createSamplePokemon();
  const battle = new Battle([samplePokemon.pikachu], [samplePokemon.charizard]);
  
  tester.assert(battle.player1.pokemon.length === 1, 'Player 1 should have 1 Pokemon');
  tester.assert(battle.player2.pokemon.length === 1, 'Player 2 should have 1 Pokemon');
  tester.assert(battle.turn === 1, 'Battle should start at turn 1');
  tester.assert(battle.winner === null, 'Battle should have no winner initially');
});

// Run the tests
if (require.main === module) {
  tester.runTests().catch(console.error);
}

module.exports = PokemonBattleTests;