import actions from "../actions/actions.js"
import { characterMap } from "../gamestate/characters.js"
import { Command, commandsMap } from "./commands.js"

enum ProcessCommandCode {
  Done,
  Unrecognized,
  Quit
}

const move = async (args: string[]) => {
  if (args.length != 3) {
    throw new Error("Must have 3 args: name, x, y. args: " + args)
  }
  try {
    const x = parseInt(args[1])
    const y = parseInt(args[2])
    await actions.moveCharacter(args[0], x, y)
  } catch {
    throw new Error("Couldn't parse x or y coord.")
  }
}

const fight = async (args: string[]) => {
  if (args.length != 1) {
    throw new Error("Must have 1 arg: name. args: " + args)
  }
  await actions.fight(args[0])
}

const processCommand = (input: string): ProcessCommandCode => {
  let inputParts = input.split(' ')
  if (inputParts.length < 1) {
    throw new Error("no command")
  }
  const commandString = inputParts[0]
  const args = inputParts.slice(1)
  if (commandString in commandsMap) {
    const command = commandsMap[commandString]
    switch(command) {
      case Command.Quit: 
        console.log("Quit command.")
        return ProcessCommandCode.Quit
      case Command.List:
        characterMap.forEach((_, k) => {
          console.log(k)
        });
        return ProcessCommandCode.Done
      case Command.Move:
        move(args)
        return ProcessCommandCode.Done
      case Command.Fight:
        fight(args)
        return ProcessCommandCode.Done
      default:
        return ProcessCommandCode.Unrecognized
    }
  } else {
    return ProcessCommandCode.Unrecognized
  }
}

export { ProcessCommandCode, processCommand }