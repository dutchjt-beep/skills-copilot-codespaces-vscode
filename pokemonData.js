const Pokemon = require('./pokemon');
const Move = require('./move');

// Define some basic moves
const moves = {
  tackle: new Move('Tackle', 'normal', 40, 100, 'physical', 'A basic physical attack'),
  scratch: new Move('Scratch', 'normal', 40, 100, 'physical', 'Scratches with sharp claws'),
  ember: new Move('Ember', 'fire', 40, 100, 'special', 'A small flame attack'),
  waterGun: new Move('Water Gun', 'water', 40, 100, 'special', 'Squirts water to attack'),
  vineWhip: new Move('Vine Whip', 'grass', 45, 100, 'physical', 'Strikes with vines'),
  spark: new Move('Spark', 'electric', 65, 100, 'physical', 'An electric tackle'),
  flamethrower: new Move('Flamethrower', 'fire', 90, 100, 'special', 'A powerful fire attack'),
  hydropump: new Move('Hydro Pump', 'water', 110, 80, 'special', 'A powerful water attack'),
  solarBeam: new Move('Solar Beam', 'grass', 120, 100, 'special', 'A two-turn grass attack'),
  thunderbolt: new Move('Thunderbolt', 'electric', 90, 100, 'special', 'A strong electric attack'),
  psychic: new Move('Psychic', 'psychic', 90, 100, 'special', 'A telekinetic attack'),
  earthquake: new Move('Earthquake', 'ground', 100, 100, 'physical', 'A ground-shaking attack'),
  iceBeam: new Move('Ice Beam', 'ice', 90, 100, 'special', 'A freezing cold beam'),
  rockSlide: new Move('Rock Slide', 'rock', 75, 90, 'physical', 'Drops rocks on the foe')
};

// Create sample Pokemon
function createSamplePokemon() {
  const pikachu = new Pokemon('Pikachu', 'electric', null, {
    hp: 35, attack: 55, defense: 40, speed: 90
  }, [moves.tackle, moves.spark, moves.thunderbolt, moves.tackle], 25);

  const charizard = new Pokemon('Charizard', 'fire', 'flying', {
    hp: 78, attack: 84, defense: 78, speed: 100
  }, [moves.scratch, moves.ember, moves.flamethrower, moves.earthquake], 50);

  const blastoise = new Pokemon('Blastoise', 'water', null, {
    hp: 79, attack: 83, defense: 100, speed: 78
  }, [moves.tackle, moves.waterGun, moves.hydropump, moves.iceBeam], 50);

  const venusaur = new Pokemon('Venusaur', 'grass', 'poison', {
    hp: 80, attack: 82, defense: 83, speed: 80
  }, [moves.tackle, moves.vineWhip, moves.solarBeam, moves.earthquake], 50);

  const alakazam = new Pokemon('Alakazam', 'psychic', null, {
    hp: 55, attack: 50, defense: 45, speed: 120
  }, [moves.tackle, moves.psychic, moves.psychic, moves.psychic], 50);

  const golem = new Pokemon('Golem', 'rock', 'ground', {
    hp: 80, attack: 120, defense: 130, speed: 45
  }, [moves.tackle, moves.rockSlide, moves.earthquake, moves.rockSlide], 50);

  return {
    pikachu,
    charizard,
    blastoise,
    venusaur,
    alakazam,
    golem
  };
}

module.exports = {
  moves,
  createSamplePokemon
};