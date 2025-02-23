
enum Command {
  Quit,
  List,
  Move, 
  Fight,
}

const commandsMap: { [key: string]: Command} = {
  "quit": Command.Quit,
  "exit": Command.Quit,
  "list": Command.List,
  "move": Command.Move,
  "fight": Command.Fight
}

export { Command, commandsMap }