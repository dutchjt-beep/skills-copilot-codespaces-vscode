# Pokemon Battle Simulator 🎮

A fully functioning Pokemon battle simulator built in Node.js with turn-based combat, type effectiveness, and statistical damage calculation.

## Features

- **Turn-based Combat**: Pokemon battle in turns based on their speed stats
- **Type Effectiveness**: Full type chart implementation (fire beats grass, water beats fire, etc.)
- **Damage Calculation**: Realistic Pokemon damage formulas with STAB, critical hits, and stat-based calculations
- **6 Sample Pokemon**: Includes Pikachu, Charizard, Blastoise, Venusaur, Alakazam, and Golem
- **Multiple Battle Modes**: Quick battles, specific matchups, and tournaments
- **Visual HP Bars**: ASCII health bars and detailed battle status
- **Move System**: Various moves with different power, accuracy, and types

## Installation & Usage

### Prerequisites
- Node.js (any recent version)

### Running the Simulator

1. **Start the full demonstration:**
   ```bash
   npm start
   # or
   node index.js
   ```

2. **Run specific battle:**
   ```bash
   node -e "
   const Battle = require('./battle');
   const { createSamplePokemon } = require('./pokemonData');
   const pokemon = createSamplePokemon();
   const battle = new Battle([pokemon.charizard], [pokemon.blastoise]);
   battle.startBattle();
   "
   ```

3. **Run tests:**
   ```bash
   npm test
   # or
   node test.js
   ```

## Pokemon Available

| Pokemon   | Type          | Level | HP  | Attack | Defense | Speed | Signature Moves |
|-----------|---------------|-------|-----|--------|---------|-------|-----------------|
| Pikachu   | Electric      | 25    | 60  | 40     | 32      | 57    | Thunderbolt, Spark |
| Charizard | Fire/Flying   | 50    | 153 | 104    | 98      | 120   | Flamethrower, Earthquake |
| Blastoise | Water         | 50    | 154 | 103    | 120     | 98    | Hydro Pump, Ice Beam |
| Venusaur  | Grass/Poison  | 50    | 155 | 102    | 103     | 100   | Solar Beam, Earthquake |
| Alakazam  | Psychic       | 50    | 130 | 70     | 65      | 140   | Psychic |
| Golem     | Rock/Ground   | 50    | 155 | 140    | 150     | 65    | Rock Slide, Earthquake |

## Battle Mechanics

### Turn Order
- Pokemon with higher Speed stats attack first
- In case of a tie, the order is random

### Damage Calculation
- Uses authentic Pokemon damage formulas
- Includes STAB (Same Type Attack Bonus) - 1.5x damage when move type matches Pokemon type
- Critical hits have a 1/16 chance and deal 2x damage
- Random damage variation (85-100% of calculated damage)

### Type Effectiveness
Full type chart implementation:
- **Super Effective** (2x damage): Fire → Grass, Water → Fire, Electric → Flying, etc.
- **Not Very Effective** (0.5x damage): Fire → Water, Grass → Fire, etc.  
- **No Effect** (0x damage): Normal → Ghost, Electric → Ground, etc.

### Status Display
```
Charizard (Lv.50)
HP: 99/153 [█████████████░░░░░░░] 65%
Type: fire/flying
Status: Normal
```

## Sample Battle Output

```
🥊 POKEMON BATTLE BEGINS! 🥊
==================================================
Player 1 sends out Charizard!
Player 2 sends out Blastoise!

--- Turn 1 ---
Charizard used Flamethrower! It's not very effective...
Blastoise takes 23 damage!
Blastoise used Water Gun! It's super effective!
Charizard takes 54 damage!

Current Status:
Charizard (Lv.50)
HP: 99/153 [█████████████░░░░░░░] 65%
Type: fire/flying
Status: Normal

Blastoise (Lv.50)
HP: 131/154 [█████████████████░░░] 85%
Type: water
Status: Normal
```

## Code Structure

- **`pokemon.js`** - Pokemon class with stats, HP management, and status tracking
- **`move.js`** - Move class with damage calculation and type effectiveness 
- **`battle.js`** - Battle management and turn-based combat logic
- **`pokemonData.js`** - Sample Pokemon and move definitions
- **`index.js`** - Main CLI interface and demonstration modes
- **`test.js`** - Test suite for core functionality

## Extending the Simulator

### Adding New Pokemon
```javascript
const newPokemon = new Pokemon('Mew', 'psychic', null, {
  hp: 100, attack: 100, defense: 100, speed: 100
}, [moves.psychic, moves.tackle], 50);
```

### Adding New Moves
```javascript
const newMove = new Move('Hyper Beam', 'normal', 150, 90, 'special', 'Powerful beam attack');
```

### Creating Custom Battles
```javascript
const battle = new Battle([pokemon1], [pokemon2]);
battle.startBattle();
```

## Technical Details

- **Language**: JavaScript (Node.js)
- **Dependencies**: None (pure Node.js)
- **Architecture**: Object-oriented with separate classes for Pokemon, Moves, and Battles
- **Damage Formula**: Based on authentic Pokemon game mechanics
- **Type System**: Complete 18-type effectiveness chart

## License

MIT License - Feel free to use and modify!
