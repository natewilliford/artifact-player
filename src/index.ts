import 'dotenv/config';
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import { processCommand, ProcessCommandCode } from './cli/commandProcessor.js';
import actions from './actions/actions.js';

const main = async () => {
  console.log('Starting up!');

  console.log("Loading characters.")
  const res = await actions.loadCharacters()
  
  const rl = readline.createInterface({ input, output })
  let quitting = false
  try {
    while(!quitting) {
      try {
        const answer = await rl.question("command: ")
        const commandCode = processCommand(answer)
        switch (commandCode) {
          case ProcessCommandCode.Unrecognized:
            throw new Error("Unrecognized command.")
          case ProcessCommandCode.Quit:
            console.log("Quitting.")
            quitting = true
          case ProcessCommandCode.Done:
            // Expected. Do nothing.
            break
          default: 
            console.error("Unrecognized process command code: " + commandCode)
        }
      } catch (err) {
        console.error(err) 
      }
    }
  } finally {
    rl.close()
  }
}

main();