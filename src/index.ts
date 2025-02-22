import 'dotenv/config';
import { fight, moveCharacter } from './api/api.js';
import { Names } from './character.js';

const main = async () => {
  console.log('Starting up!');

  console.log('Moving Vaelric to 0, 1');
  moveCharacter(Names.Vaelric, 0, 1);
  // wait for 5 seconds (a little more than the cooldown)
  await new Promise(resolve => setTimeout(resolve, 5100));
  console.log('fighting.')
  fight(Names.Vaelric);
}

main();