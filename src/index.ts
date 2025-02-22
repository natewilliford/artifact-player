import 'dotenv/config';
import { moveCharacter } from './api.js';
import { Names } from './character.js';

console.log('Hello, world!');

moveCharacter(Names.Vaelric, 1, 0);