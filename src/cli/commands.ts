
enum Command {
  Quit,
  List,
  Move, 
  Fight,
  Rest,
  Stats,
  RunProgram,
}

const commandsMap: { [key: string]: Command} = {
  "quit": Command.Quit,
  "q": Command.Quit,
  "exit": Command.Quit,
  "list": Command.List,
  "move": Command.Move,
  "fight": Command.Fight,
  "rest": Command.Rest,
  "stats": Command.Stats,
  "run-program": Command.RunProgram
}

export { Command, commandsMap }