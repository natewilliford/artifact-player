import 'dotenv/config';
import { exit, stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import { Command, commands } from './commands.js';

const main = async () => {
  console.log('Starting up!');

  const rl = readline.createInterface({ input, output })
  try {
    while(true) {
      try {
        const answer = await rl.question("command: ")

        const answerParts = answer.split(' ')
        if (answerParts.length < 1) {
          throw new Error("no command")
        } 
        const commandString = answerParts[0].toLowerCase()
        const args = answerParts.slice(1)
        if (commandString in commands) {
          const command = commands[commandString]
          switch(command) {
            case Command.Quit: 
              console.log("Quitting.")
              exit()
              break;
            case Command.Move:
              console.log("Move command. args: ", args)
              break
            case Command.Fight:
              console.log("Fight command. args: ", args)
              break
            default:
              throw new Error("Unrecognized command: " + commandString)
          }
        } else {
          throw new Error("Unrecognized command: " + commandString)
        }

        console.log(`echo: ${answer}`)
      } catch (err) {
        console.error("Input error", err) 
      } 
    }
  } finally {
    rl.close()
  }
}

main();