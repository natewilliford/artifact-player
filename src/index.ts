import 'dotenv/config';
import { fight, moveCharacter } from './api/api.js';
import { Names } from './character.js';
import { Character } from './gamestate/character.js';

const main = async () => {
  console.log('Starting up!');
  const character = new Character()

  console.log('Moving Vaelric to 0, 1');
  const res = await moveCharacter(Names.Vaelric, 0, 0);
  if (res) {
    character.updateCharacter(res.character, res.cooldown);
    character.getCoolDownExpiration()
    // console.log(character.getCoolDownExpiration())
  } else {
    console.error('Null response from moveCharacter');
  }

  // // wait for 5 seconds (a little more than the cooldown)
  // await new Promise(resolve => setTimeout(resolve, 5100));
  // console.log('fighting.')
  // fight(Names.Vaelric);
}

main();