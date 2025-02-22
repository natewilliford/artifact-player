import 'dotenv/config';
import { moveCharacter } from './api/api.js';
import { Names } from './character.js';

console.log('Starting up!');

moveCharacter(Names.Vaelric, 1, 0);