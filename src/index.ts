import 'dotenv/config';
import actions from './actions/actions.js';
import { Names } from './character.js';
import { Character } from './gamestate/character.js';

const main = async () => {
  console.log('Starting up!');
  const character = new Character(Names.Vaelric)

  // actions.moveCharacter(character, 0, 1)
  actions.fight(character)
}

main();